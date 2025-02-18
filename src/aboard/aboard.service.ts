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

  async getPostsByUsername(
    username: string,
    page: number = 1,
    query: string = '',
    tag: string = '',
  ): Promise<Post[]> {
    const pageSize = 30; // Number of posts per page
    const skip = (page - 1) * pageSize;

    // Build the filter criteria for searching
    const match: {
      $or?: (
        | { title: { $regex: string; $options: string } }
        | { content: { $regex: string; $options: string } }
      )[];
      tags?: { $in: string[] };
      username?: string; // Filter by username
    } = { username }; // Always filter by the provided username

    if (query) {
      match.$or = [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search in title
        { content: { $regex: query, $options: 'i' } }, // Case-insensitive search in content
      ];
    }

    if (tag) {
      match.tags = { $in: [tag] }; // Filter by tags if provided
    }

    const posts = await this.postModel.aggregate([
      { $match: match }, // Apply the filter criteria (username, query, and tag)
      { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
      { $skip: skip }, // Skip the posts based on the page number
      { $limit: pageSize }, // Limit the results to the page size
      {
        $lookup: {
          from: 'comments', // The collection for comments
          localField: '_id',
          foreignField: 'postId',
          as: 'comments',
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

  // async getPostsByUsername(username: string): Promise<Post[]> {
  //   const posts = await this.postModel.aggregate([
  //     { $match: { username } }, // Match posts by username
  //     { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
  //     { $limit: 30 }, // Limit the results to 30 posts
  //     {
  //       $lookup: {
  //         from: 'comments', // The collection for comments (Mongoose uses lowercase and plural)
  //         localField: '_id',
  //         foreignField: 'postId',
  //         as: 'comments', // Create the comments array in the result
  //       },
  //     },
  //     {
  //       $addFields: {
  //         commentCount: { $size: '$comments' }, // Add a field with the count of comments
  //       },
  //     },
  //     { $project: { comments: 0 } }, // Optionally remove the comments array from the result
  //   ]);

  //   return posts as Post[];
  // }

  // async getPosts(): Promise<Post[]> {
  //   const posts = await this.postModel.aggregate([
  //     { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
  //     { $limit: 30 }, // Limit the results to 30 posts
  //     {
  //       $lookup: {
  //         from: 'comments', // The collection for comments (Mongoose uses lowercase and plural)
  //         localField: '_id',
  //         foreignField: 'postId',
  //         as: 'comments', // Create the comments array in the result
  //       },
  //     },
  //     {
  //       $addFields: {
  //         commentCount: { $size: '$comments' }, // Add a field with the count of comments
  //       },
  //     },
  //     { $project: { comments: 0 } }, // Optionally remove the comments array from the result
  //   ]);

  //   return posts as Post[];
  // }

  async getPosts(
    page: number = 1,
    query: string = '',
    tag: string = '',
  ): Promise<Post[]> {
    const pageSize = 30; // Number of posts per page
    const skip = (page - 1) * pageSize;

    // Build the filter criteria for searching
    const match: {
      $or?: (
        | { title: { $regex: string; $options: string } }
        | { content: { $regex: string; $options: string } }
      )[];
      tags?: { $in: string[] };
    } = {};

    if (query) {
      match.$or = [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search in title
        { content: { $regex: query, $options: 'i' } }, // Case-insensitive search in content
      ];
    }

    if (tag) {
      match.tags = { $in: [tag] }; // Filter by tags if provided
    }

    const posts = await this.postModel.aggregate([
      { $match: match }, // Apply the filter criteria (query and tag)
      { $sort: { createdAt: -1 } }, // Sort by 'createdAt' field in descending order
      { $skip: skip }, // Skip the posts based on the page number
      { $limit: pageSize }, // Limit the results to the page size
      {
        $lookup: {
          from: 'comments', // The collection for comments
          localField: '_id',
          foreignField: 'postId',
          as: 'comments',
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
      postId: new mongoose.Types.ObjectId(postId),
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
