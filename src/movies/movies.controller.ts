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

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page: number = 1,
  ): Promise<MovieDto[]> {
    if (!query) {
      const list1 = await this.moviesService.fetchMovies('movie/popular');
      const list2 = await this.moviesService.fetchMovies('movie/popular', 2);
      return [...list1, ...list2];
    }
    const data = await this.moviesService.searchMovies(query, page);
    return data.filter(
      (movie) =>
        movie.poster_path.endsWith('jpg') &&
        movie.backdrop_path.endsWith('jpg'),
    );
  }

  @Get('show')
  async getShows(@Query('page') page: number = 1): Promise<MovieDto[]> {
    const data = await this.moviesService.fetchMovies('discover/tv', page);
    return data.filter(
      (movie) =>
        movie.poster_path.endsWith('jpg') &&
        movie.backdrop_path.endsWith('jpg'),
    );
  }

  @Get('movies')
  async getMovies(@Query('page') page: number = 1): Promise<MovieDto[]> {
    const data = await this.moviesService.fetchMovies('discover/movie', page);
    return data.filter(
      (movie) =>
        movie.poster_path.endsWith('jpg') &&
        movie.backdrop_path.endsWith('jpg'),
    );
  }

  @Get('latest')
  async getLatest(@Query('page') page: number = 1): Promise<MovieDto[]> {
    return this.moviesService.fetchMovies('trending/all/day', page);
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
