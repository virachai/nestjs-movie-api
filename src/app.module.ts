import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AboardModule } from './aboard/aboard.module';
import { CronController } from './cron/cron.controller';
import { DatabaseService } from './database/database.service';

dotenv.config();

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

@Module({
  imports: [
    MongooseModule.forRoot(dbURI),
    AboardModule,
    AuthModule,
    MoviesModule,
  ],
  controllers: [AppController, CronController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
