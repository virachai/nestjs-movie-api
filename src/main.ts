import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all routes
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  // Enable Swagger conditionally based on the SWAGGER environment variable
  const swagger_env = process.env.SWAGGER || 0;
  if (swagger_env === '1') {
    // Check if SWAGGER is "1"
    const config = new DocumentBuilder()
      .setTitle('Movie example')
      .setDescription('The Movie API description')
      .setVersion('1.0')
      .addTag('movie')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => console.error(err));
