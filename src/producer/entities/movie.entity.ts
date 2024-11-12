import { Producer } from './producer.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  year: number;

  @Column()
  title: string;
  
  @Column()
  winner: boolean;

  @ManyToOne(() => Producer, producer => producer.movies)
  @JoinColumn({ name: 'producerId' })
  producer: Producer
}
