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

  async fetchMovieById(id: string): Promise<MovieDto | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<MovieDto>(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
              accept: 'application/json',
            },
          },
        ),
      );

      // Map the result to the MovieDto format
      return this.mapMoviesToDto([data])[0] || null; // If no data, return null
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      return null; // Return null if there's an error fetching the movie data
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{
          page: number;
          results: any[];
          total_pages: number;
          total_results: number;
        }>(
          `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&query=${query}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
              accept: 'application/json',
            },
          },
        ),
      );

      // Map the results to the MovieDto format
      return this.mapMoviesToDto(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      return []; // Return an empty array if there's an error
    }
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
      genres: movie.genres,
    }));
  }
}
