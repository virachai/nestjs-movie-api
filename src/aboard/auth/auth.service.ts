import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserDataDTO } from './dto/userdata.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async authenticate(username: string, pass: string): Promise<any> {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: pass,
          expiresInMins: 60,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        return response.json();
      }

      const payload = (await response.json()) as UserDataDTO;

      if (payload?.accessToken) delete payload.accessToken;
      if (payload?.refreshToken) delete payload.refreshToken;

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '60m',
      });

      return { ...payload, accessToken };
    } catch (error) {
      return error;
    }
  }

  // Get current user
  async getCurrentUser(id: string): Promise<any> {
    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      if (!response.ok) {
        return response.json();
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw new Error('Failed to fetch current user');
    }
  }
}
