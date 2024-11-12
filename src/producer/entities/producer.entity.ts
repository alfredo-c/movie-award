import { Movie } from './movie.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Movie, movie => movie.producer, { cascade: true })
  movies: Movie[];
}
