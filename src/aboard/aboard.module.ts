import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboardController } from './aboard.controller';
import { AboardService } from './aboard.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { RequestMethod, MiddlewareConsumer, NestModule } from '@nestjs/common';

@Module({
  imports: [
    // Register Mongoose schemas for the `Post` and `Comment` collections
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }, // Register Post schema
      { name: Comment.name, schema: CommentSchema }, // Register Comment schema
    ]),
    AuthModule,
  ],
  controllers: [AboardController], // Register the controller
  providers: [AboardService], // Register the service
})
export class AboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'aboard/posts',
        method: RequestMethod.POST,
      },
      {
        path: 'aboard/posts',
        method: RequestMethod.PUT,
      },
      {
        path: 'aboard/posts',
        method: RequestMethod.DELETE,
      },
      {
        path: 'posts/:id/comments',
        method: RequestMethod.POST,
      },
      {
        path: 'aboard/user/:username/posts',
        method: RequestMethod.GET,
      },
    );
  }
}
