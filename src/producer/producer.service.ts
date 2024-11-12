import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProducerDto, MovieDto } from './dto/create-producer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducerService implements OnModuleInit {

  constructor(
    @InjectRepository(Producer)
    private repository: Repository<Producer>,
  ) {}

  onModuleInit() {
    console.log('Loading database from file...');
    this.dumpData();
  }

  async dumpData() {
    const filePath = path.join(process.cwd(), 'movielist.csv');
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');

      let firstLine = true;
      let producerHash: { [key: string]: CreateProducerDto } = {};
      for (const line of fileContent.split('\n')) {
        if (firstLine || line === '') {
          firstLine = false;
          continue;
        }

        const [year, title, _studio, name, winner] = line.split(';');

        if (!producerHash[name]) {
          producerHash[name] = { name, movies: [] };
        }

        producerHash[name].movies.push({ year: parseInt(year), title, winner: winner === 'yes' });
      }

      for (const producer of Object.values(producerHash)) {
        await this.create(producer);
      }

      console.log('Loading database finished');
    } catch (error) {
      console.error('Error reading file:', error.message);
      throw new Error('Could not read file');
    }
  }

  async create(createProducerDto: CreateProducerDto) {
    return this.repository.save(createProducerDto);
  }

  async findAwardIntervals() {
    const producers = await this.repository.find({
      relations: ['movies'], 
    });

    const producersWithTwoWinners = producers.filter(producer => producer.movies.filter(movie => movie.winner).length >= 2);

    const producersWithInterval = producersWithTwoWinners.map(producer => {
      let minInterval = Number.MAX_SAFE_INTEGER;
      let minFirstWinIndex = -1;
      let minSecondWinIndex = -1;
      let maxInterval = 0;
      let maxFirstWinIndex = -1;
      let maxSecondWinIndex = -1;

      const movies = producer.movies.sort((a, b) => a.year - b.year);
      for (let i = 0; i < movies.length - 1; i++) {
        const interval = movies[i + 1].year - movies[i].year;
        if (interval < minInterval) {
          minInterval = interval;
          minFirstWinIndex = i;
          minSecondWinIndex = i + 1;
        }
        if (interval > maxInterval) {
          maxInterval = interval;
          maxFirstWinIndex = i;
          maxSecondWinIndex = i + 1;
        }
      }

      return {
        producer: producer.name,
        minInterval,
        minPreviousWin: movies[minFirstWinIndex]?.year,
        minFollowingWin: movies[minSecondWinIndex]?.year,
        maxInterval,
        maxPreviousWin: movies[maxFirstWinIndex]?.year,
        maxFollowingWin: movies[maxSecondWinIndex]?.year,
      };
    }).filter(element => element !== null);

    const minInterval = producersWithInterval.reduce((acc, curr) => curr.minInterval < acc.minInterval ? curr : acc, producersWithInterval[0]);
    const maxInterval = producersWithInterval.reduce((acc, curr) => curr.maxInterval > acc.maxInterval ? curr : acc, producersWithInterval[0]);

    return {
      min: producersWithInterval.filter(producer => producer.minInterval === minInterval.minInterval).map(producer => ({
        producer: producer.producer,
        interval: producer.minInterval,
        previousWin: producer.minPreviousWin,
        followingWin: producer.minFollowingWin,
      })),
      max: producersWithInterval.filter(producer => producer.maxInterval === maxInterval.maxInterval).map(producer => ({
        producer: producer.producer,
        interval: producer.maxInterval,
        previousWin: producer.maxPreviousWin,
        followingWin: producer.maxFollowingWin,
      })),
    };
  }
}
