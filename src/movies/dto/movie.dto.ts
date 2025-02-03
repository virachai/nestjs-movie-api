// src/movies/dto/movie.dto.ts
export class MovieDto {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string; // This is typically in the form of a date string
  genre_ids: number[] | object[];
  release_year?: number; // Optional property, can be computed if not provided
  genres?: number[] | object[];

  // Optional constructor to initialize the object more easily if needed
  constructor(
    id: number,
    backdrop_path: string,
    poster_path: string,
    title: string,
    overview: string,
    release_date: string,
    genre_ids: number[] | object[],
    release_year?: number,
    genres?: number[] | object[],
  ) {
    this.id = id;
    this.backdrop_path = backdrop_path;
    this.poster_path = poster_path;
    this.title = title;
    this.overview = overview;
    this.release_date = release_date;
    this.genre_ids = genre_ids;
    this.release_year = release_year || undefined;
    this.genres = genres || [];
  }
}
