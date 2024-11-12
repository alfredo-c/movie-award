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
    return producers.map(producer => {
      const movies = producer.movies.sort((a, b) => a.year - b.year);
      const hasAtLeastTwoWinners = movies.filter(movie => movie.winner).length >= 2;
      if(!hasAtLeastTwoWinners) return null;

      let minInterval = Number.MAX_SAFE_INTEGER;
      let firstWinIndex = -1;
      let secondWinIndex = -1;
      
      for (let i = 0; i < movies.length - 1; i++) {
        if (movies[i].winner && movies[i + 1].winner) {
          const interval = movies[i + 1].year - movies[i].year;
          if (interval < minInterval) {
            minInterval = interval;
            firstWinIndex = i;
            secondWinIndex = i + 1;
          }
        } 
      }

      return {
        producer: producer.name,
        interval: minInterval,
        previousWin: movies[firstWinIndex]?.year,
        followingWin: movies[secondWinIndex]?.year,
      };
    }).filter(element => element !== null);
  }
}
