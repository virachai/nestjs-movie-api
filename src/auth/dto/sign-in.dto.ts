// src/auth/dto/sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'The username for authentication',
    default: 'netflix', // Default value for Swagger UI
  })
  username: string;

  @ApiProperty({
    description: 'The password for authentication',
    default: 'JSD#8@genKX', // Default value for Swagger UI
  })
  password: string;
}
