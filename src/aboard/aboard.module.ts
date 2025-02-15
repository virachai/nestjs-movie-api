import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboardController } from './aboard.controller';
import { AboardService } from './aboard.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    // Register Mongoose schemas for the `Post` and `Comment` collections
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }, // Register Post schema
      { name: Comment.name, schema: CommentSchema }, // Register Comment schema
    ]),
  ],
  controllers: [AboardController], // Register the controller
  providers: [AboardService], // Register the service
})
export class AboardModule {}
