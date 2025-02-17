// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose'; // Import Types for ObjectId
// import { Comment } from './comment.schema';
// import { HydratedDocument } from 'mongoose';

// export type PostDocument = HydratedDocument<Post>;

// @Schema({ timestamps: true })
// export class Post extends Document {
//   @Prop({ required: true, minlength: 1, maxlength: 100 })
//   title: string;

//   @Prop({ required: true, minlength: 1, maxlength: 5000 })
//   content: string;

//   @Prop({ required: true, minlength: 1, maxlength: 50 })
//   username: string;

//   @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
//   comments: Comment[];

//   @Prop({ type: [String], default: [], index: true })
//   tags: string[];
// }

// export const PostSchema = SchemaFactory.createForClass(Post);

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

  // Virtual field for comment count
  @Prop({ virtual: true })
  commentCount: number;
}

// Create the schema
export const PostSchema = SchemaFactory.createForClass(Post);

// Virtual property for comment count, to count the comments dynamically
PostSchema.virtual('commentCount').get(function (this: Post) {
  return this.comments ? this.comments.length : 0;
});

// Enable virtual fields to be included in the JSON output
PostSchema.set('toJSON', {
  virtuals: true,
});
PostSchema.set('toObject', {
  virtuals: true,
});
