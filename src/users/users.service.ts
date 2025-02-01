import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as process from 'process';
import * as bcrypt from 'bcrypt';

dotenv.config();

export interface User {
  userId: number;
  username: string;
  passwordHash: string; // Store the hash, not the plain password
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: process.env.DEMO_USERNAME_01 || 'username_01',
      passwordHash:
        process.env.DEMO_PASSWORD_01 ||
        '$2b$10$KK7kh0Hi0KWV/DMBRw2S3OnP9BnY54Wf8tLBwPFv32aso.g1jZsmW',
    },
    {
      userId: 2,
      username: process.env.DEMO_USERNAME_02 || 'username_02',
      passwordHash:
        process.env.DEMO_PASSWORD_02 ||
        '$2b$10$KK7kh0Hi0KWV/DMBRw2S3OnP9BnY54Wf8tLBwPFv32aso.g1jZsmW',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.username === username);
    return Promise.resolve(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    const salt = process.env.PASSWORD_SALT || 'salt';
    return bcrypt.compare(password + salt, user.passwordHash);
  }

  async createUser(username: string, password: string): Promise<User> {
    const salt = process.env.PASSWORD_SALT || 'salt';
    const passwordHash = await bcrypt.hash(password + salt, 10);
    const newUser: User = {
      userId: this.users.length + 1, // In real app get it from database
      username,
      passwordHash, // Store the hashed password.
    };
    this.users.push(newUser);
    console.log('New user created:', newUser);
    return newUser;
  }
}
