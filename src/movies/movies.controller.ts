// src/movies/movies.controller.ts
import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  private async getDataTrending(): Promise<{
    billboard: MovieDto[];
    trending: MovieDto[];
  }> {
    const trending = await this.moviesService.fetchMovies(
      'trending/movie/week',
    );
    const hour = new Date().getHours();
    const billboardIndex = hour % trending.length;
    const billboard = trending.splice(billboardIndex, 1);

    return { billboard, trending };
  }

  @Get('billboard')
  async getBillboard(): Promise<MovieDto[]> {
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
    @Query('profileId') profileId: string,
  ): Promise<MovieDto[]> {
    // Validate profileId
    if (!profileId || Number(profileId) > 5) {
      throw new NotFoundException('Profile not found');
    }

    return this.moviesService.fetchMovies(
      'movie/now_playing',
      Number(profileId),
    );
  }

  @Get('exclusive')
  async getOnlyOnNetflix(): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies(
      `account/${process.env.TMDB_ACCOUNT_ID}/favorite/movies`,
    );
  }

  @Get('my-list')
  async getMyList(@Query('profileId') profileId: string): Promise<MovieDto[]> {
    // Validate profileId
    if (!profileId || Number(profileId) > 5) {
      throw new NotFoundException('Profile not found');
    }

    return this.moviesService.fetchMovies(
      `account/${process.env.TMDB_ACCOUNT_ID}/watchlist/movies`,
      Number(profileId),
    );
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string): Promise<MovieDto> {
    // Fetch the movie data from the service
    const movie = await this.moviesService.fetchMovieById(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }
}
