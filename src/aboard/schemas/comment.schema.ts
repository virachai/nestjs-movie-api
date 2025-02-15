import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 1, maxlength: 500 })
  content: string;

  @Prop({ required: true, minlength: 1, maxlength: 50 })
  username: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
