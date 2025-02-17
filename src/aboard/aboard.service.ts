import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from './schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import mongoose from 'mongoose';

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

  async getPostsByUsername(username: string): Promise<Post[]> {
    const posts = await this.postModel.aggregate([
      { $match: { username } }, // Match posts by username
      { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
      { $limit: 30 }, // Limit the results to 30 posts
      {
        $lookup: {
          from: 'comments', // The collection for comments (Mongoose uses lowercase and plural)
          localField: '_id',
          foreignField: 'postId',
          as: 'comments', // Create the comments array in the result
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }, // Add a field with the count of comments
        },
      },
      { $project: { comments: 0 } }, // Optionally remove the comments array from the result
    ]);

    return posts as Post[];
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.postModel.aggregate([
      { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
      { $limit: 30 }, // Limit the results to 30 posts
      {
        $lookup: {
          from: 'comments', // The collection for comments (Mongoose uses lowercase and plural)
          localField: '_id',
          foreignField: 'postId',
          as: 'comments', // Create the comments array in the result
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }, // Add a field with the count of comments
        },
      },
      { $project: { comments: 0 } }, // Optionally remove the comments array from the result
    ]);

    return posts as Post[];
  }

  // Create a new post
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  // Fetch a single post by ID with populated comments data
  async getPost(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    try {
      const objectId = new mongoose.Types.ObjectId(postId);
      const comments = await this.commentModel
        .find({ postId: objectId })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .exec();

      console.log('comments', comments, postId);
      return comments;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
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
