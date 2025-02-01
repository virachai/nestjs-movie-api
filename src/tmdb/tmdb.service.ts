// src/tmdb/tmdb.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

@Injectable()
export class TmdbService {
  private readonly apiKey = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  async getPopularMovies(): Promise<any> {
    const url = `${this.baseUrl}/movie/popular`;
    const response = await axios.get(url, {
      params: {
        api_key: this.apiKey,
      },
    });
    return response.data;
  }
}
