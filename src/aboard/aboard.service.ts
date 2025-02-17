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

  // Fetch posts from the database by username
  async getPostsByUsername(username: string): Promise<Post[]> {
    return this.postModel
      .find({ username }) // Find posts where username matches
      .sort({ createdAt: -1 }) // Sort by 'createdAt' field in descending order
      .limit(30) // Limit the results to 30 posts
      .exec(); // Execute the query
  }

  // Fetch all posts
  async getPosts(): Promise<Post[]> {
    return this.postModel
      .find() // Find all posts
      .sort({ createdAt: -1 }) // Sort by 'createdAt' field in descending order
      .limit(30) // Limit the results to 30 posts
      .exec(); // Execute the query
  }

  // Create a new post
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  // Fetch a single post by ID
  async getPost(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  // Fetch comments for a specific post
  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).exec();
  }

  // Create a comment for a post
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

  // Update a post
  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  // Delete a post
  async deletePost(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
