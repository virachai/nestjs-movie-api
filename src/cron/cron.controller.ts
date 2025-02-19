import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('cron')
export class CronController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('keep-alive')
  async keepAlive() {
    const { db } = await this.databaseService.connectToDatabase();
    const collection = db.collection('planets');
    const data = await collection.find({}).toArray();

    return { message: 'Cron job executed successfully!', data };
  }
}
