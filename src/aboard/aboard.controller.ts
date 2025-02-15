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

  @Post('auth')
  signIn(@Body() signInDto: SignInDto) {
    console.log('signInDto: ', signInDto);
    return this.aboardService.authenticate(
      signInDto.username,
      signInDto.password,
    );
  }

  @Get('posts')
  async getPosts() {
    return this.aboardService.getPosts();
  }

  @Post('posts')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.aboardService.createPost(createPostDto);
  }

  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return this.aboardService.getPost(id);
  }

  @Get('posts/:id/comments')
  async getPostComments(@Param('id') id: string) {
    return this.aboardService.getPostComments(id);
  }

  @Post('posts/:id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.aboardService.createComment(id, createCommentDto);
  }

  @Put('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.aboardService.updatePost(id, updatePostDto);
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return this.aboardService.deletePost(id);
  }
}
