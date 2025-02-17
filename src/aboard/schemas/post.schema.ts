import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types for ObjectId
import { Comment } from './comment.schema';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 1, maxlength: 5000 })
  content: string;

  @Prop({ required: true, minlength: 1, maxlength: 50 })
  username: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: [String], default: [], index: true })
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
