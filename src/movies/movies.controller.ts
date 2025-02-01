// src/movies/movies.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
// import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  private async getDataTrending(): Promise<{
    billboard: MovieDto;
    trending: MovieDto[];
  }> {
    const trending = await this.moviesService.fetchMovies('trending/movie/day');
    const hour = new Date().getHours();
    const billboardIndex = hour % trending.length;
    const [billboard] = trending.splice(billboardIndex, 1);

    return { billboard, trending };
  }

  @Get('billboard')
  async getBillboard(): Promise<MovieDto> {
    const { billboard } = await this.getDataTrending();
    return billboard;
  }

  @Get('trending')
  async getTrending(): Promise<MovieDto[]> {
    const { trending } = await this.getDataTrending();
    return trending;
  }

  @Get('must-watch')
  async getMustWatch(): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies('movie/top_rated');
  }

  @Get('continue-watching')
  async getContinueWatching(
    @Query('userId') userId: string,
  ): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies('movie/now_playing', Number(userId));
  }

  @Get('only-on-netflix')
  async getOnlyOnNetflix(): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies('movie/now_playing');
  }

  @Get('popular')
  async getpPpular(): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies(`list/8509994`);
  }

  @Get('list')
  async getListMovie(): Promise<MovieDto[]> {
    const listID = 8509993; // You can replace this with any list ID or make it dynamic
    return this.moviesService.fetchMovieByListID(listID);
  }

  @Get('my-list')
  async getMyList(@Query('userId') userId: string): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies(
      `account/${process.env.TMDB_ACCOUNT_ID}/watchlist/movies`,
      Number(userId),
    );
  }
}
