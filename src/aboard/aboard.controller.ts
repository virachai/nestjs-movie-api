import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AboardService } from './aboard.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SignInDto } from '../auth/dto/sign-in.dto'; // Import the DTO for sign-in

@Controller('aboard')
export class AboardController {
  constructor(private readonly aboardService: AboardService) {}

  // Sign in endpoint
  @Post('auth')
  signIn(@Body() signInDto: SignInDto) {
    return this.aboardService.authenticate(
      signInDto.username,
      signInDto.password,
    );
  }

  // Get all posts
  @Get('posts')
  async getPosts() {
    return this.aboardService.getPosts();
  }

  // Get posts by username
  @Get('user/:username/posts')
  async getPostsByUsername(@Param('username') username: string) {
    return this.aboardService.getPostsByUsername(username);
  }

  // Create a new post
  @Post('posts')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.aboardService.createPost(createPostDto);
  }

  // Get a single post by ID
  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return this.aboardService.getPost(id);
  }

  // Get comments for a post
  @Get('posts/:id/comments')
  async getPostComments(@Param('id') id: string) {
    return this.aboardService.getPostComments(id);
  }

  // Create a comment for a post
  @Post('posts/:id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.aboardService.createComment(id, createCommentDto);
  }

  // Update a post
  @Put('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.aboardService.updatePost(id, updatePostDto);
  }

  // Delete a post
  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return this.aboardService.deletePost(id);
  }
}
