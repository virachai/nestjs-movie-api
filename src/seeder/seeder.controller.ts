import { Controller, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  // Endpoint to trigger seeding
  @Get('seed')
  async seed() {
    try {
      await this.seederService.seedData();
      return { message: 'Seeding successful' };
    } catch (error) {
      if (error) return { message: 'Seeding failed' };
    }
  }
}
