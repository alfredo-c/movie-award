import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('stats/award-intervals')
  async findAwardIntervals(): Promise<any> {
    return this.producerService.findAwardIntervals();
  }
}
