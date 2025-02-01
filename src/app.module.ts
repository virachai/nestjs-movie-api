import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TmdbService } from './tmdb/tmdb.service';
import { AuthModule } from './auth/auth.module';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, MoviesController],
  providers: [AppService, TmdbService],
})
export class AppModule {}
