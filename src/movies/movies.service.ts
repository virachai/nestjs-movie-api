import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly httpService: HttpService) {}

  async fetchMovies(endpoint: string, page: number = 1): Promise<MovieDto[]> {
    // Fetch data from the TMDB API with the page parameter
    const { data } = await firstValueFrom(
      this.httpService.get<{
        page: number;
        results: any[];
        total_pages: number;
        total_results: number;
      }>(`https://api.themoviedb.org/3/${endpoint}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          accept: 'application/json',
        },
      }),
    );

    // Map the results to the MovieDto format
    return this.mapMoviesToDto(data.results);
  }

  async fetchMovieByListID(listID: number): Promise<MovieDto[]> {
    // Fetch data from the TMDB API with a list ID
    const { data } = await firstValueFrom(
      this.httpService.get<{
        items: any[];
      }>(`https://api.themoviedb.org/3/list/${listID}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          accept: 'application/json',
        },
      }),
    );

    // Map the results to the MovieDto format
    return this.mapMoviesToDto(data.items);
  }

  // Helper function to map the movie data to MovieDto format
  private mapMoviesToDto(movies: any[]): MovieDto[] {
    return movies.map((movie: MovieDto) => ({
      id: movie.id,
      backdrop_path: 'https://image.tmdb.org/t/p/w1280/' + movie.backdrop_path,
      poster_path: 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      genre_ids: movie.genre_ids,
      release_year: new Date(movie.release_date).getFullYear(),
    }));
  }
}
