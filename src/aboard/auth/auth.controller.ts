import { AuthService } from './auth.service';
import { SignInDto } from '../../auth/dto/sign-in.dto';
import { Controller, Post, Body, Get, Param } from '@nestjs/common';

@Controller('aboard/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign in endpoint
  @Post()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(
      signInDto.username,
      signInDto.password,
    );
  }

  @Get('me/:id')
  async getCurrentUser(@Param('id') id: string): Promise<any> {
    return this.authService.getCurrentUser(id);
  }
}
