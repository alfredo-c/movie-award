import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ProducerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
