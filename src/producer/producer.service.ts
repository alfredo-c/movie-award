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

  async findAll() {
    return this.repository.find({
      relations: ['movies'],
    });
  }
}
