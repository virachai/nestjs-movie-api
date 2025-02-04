// // src/auth/auth.service.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

// @Injectable()
// export class AuthService {
//   constructor(private usersService: UsersService) {}

//   async signIn(username: string, pass: string): Promise<any> {
//     const user = await this.usersService.findOne(username);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     const validate = await this.usersService.validatePassword(user, pass);
//     if (!validate) {
//       throw new UnauthorizedException();
//     }

//     const payload = {
//       userId: user.userId,
//       username: user.username,
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     return { access_token: token };
//   }
// }

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private configService: ConfigService, // Inject the ConfigService to fetch env variables
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    // Find the user by username
    const user = await this.usersService.findOne(username);
    if (!user) {
      this.logger.warn(`Login attempt failed for username: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(
      user,
      pass,
    );
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for username: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Prepare the JWT payload
    const payload = {
      userId: user.userId,
      username: user.username,
    };

    // Fetch JWT secret from environment variable
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      this.logger.error('JWT secret not defined in environment variables');
      throw new UnauthorizedException(
        'Authentication service configuration error',
      );
    }

    // Generate the JWT token with an expiration time of 1 day
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1d',
    });

    // Return the access token to the client
    return { access_token: token, account: payload };
  }
}
