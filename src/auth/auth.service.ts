import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const validate = await this.usersService.validatePassword(user, pass);
    if (!validate) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.userId,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { access_token: token };
  }
}
