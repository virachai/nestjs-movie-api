import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from './schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class AboardService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async authenticate(username: string, pass: string): Promise<any> {
    console.log('username: ', username);
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: pass,
          expiresInMins: 30, // optional, defaults to 60
        }),
        credentials: 'include', // Include cookies (e.g., accessToken) in the request
      });

      if (!response.ok) {
        return response.json();
      }

      return response.json();
    } catch (error) {
      return error;
    }
  }

  async getPosts(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async getPost(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).exec();
  }

  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      postId,
    });
    return createdComment.save();
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async deletePost(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
