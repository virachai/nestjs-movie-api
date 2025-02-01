// src/movies/movies.controller.ts
import { Controller, Get } from '@nestjs/common';
import { TmdbService } from '../tmdb/tmdb.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('popular')
  async getPopularMovies(): Promise<any> {
    return this.tmdbService.getPopularMovies();
  }
}
