import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { Post, PostSchema } from '../aboard/schemas/post.schema'; // Adjust path as needed
import { Comment, CommentSchema } from '../aboard/schemas/comment.schema'; // Adjust path as needed

@Module({
  imports: [
    // Import the MongooseModule to work with MongoDB
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
