import { Controller, Get } from '@nestjs/common';

@Controller('cron')
export class CronController {
  @Get('keep-alive')
  keepAlive() {
    return { message: 'Cron job executed successfully!' };
  }
}
