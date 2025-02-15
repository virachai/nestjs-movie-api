import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../aboard/schemas/post.schema';
import { Comment, CommentDocument } from '../aboard/schemas/comment.schema';
import axios from 'axios';

// Import the tag data (you may already have it as a separate file or array)
export const tagData = [
  { id: 'history', label: 'History' },
  { id: 'food', label: 'Food' },
  { id: 'pets', label: 'Pets' },
  { id: 'health', label: 'Health' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'others', label: 'Others' },
];

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async seedData() {
    const url = 'https://dummyjson.com/posts?limit=1000&select=title,body';
    const response = await axios.get<{
      posts: { title: string; body: string; tags?: string[] }[];
    }>(url);

    // Loop through the first 10 posts (or any other limit you want)
    const posts = response.data.posts.slice(0, 1000); // Limiting to 10 posts as an example

    for (const dummyPost of posts) {
      // Transform DummyJSON data to MongoDB Post document
      const postData = {
        title: dummyPost.title,
        content: dummyPost.body,
        username: this.getRandomUsername(), // Assign a random username
        tags: this.getRandomTags() || [], // Map tags directly (use empty array if no tags)
      };

      // Create and save the Post document
      const createdPost = await this.postModel.create(postData);
      console.log('Post created:', createdPost);

      // Optional: You can also create some comments for each post
      const id = createdPost._id as string;
      const comments = this.generateCommentsForPost(id);
      await this.commentModel.insertMany(comments);
      console.log(`Created comments for post ${id}`);
    }
  }

  private getRandomUsername(): string {
    const usernames = [
      'emilys',
      'michaelw',
      'sophiab',
      'jamesd',
      'emmaj',
      'oliviaw',
      'alexanderj',
      'avat',
      'ethanm',
      'isabellad',
      'liamg',
      'miar',
      'noahh',
      'charlottem',
      'williamg',
      'averyp',
      'evelyns',
      'logant',
      'abigailr',
      'jacksone',
      'madisonc',
      'elijahs',
      'chloem',
      'mateon',
      'harpere',
      'evelyng',
      'danielc',
      'lilyb',
      'henryh',
      'addisonw',
    ];
    return usernames[Math.floor(Math.random() * usernames.length)];
  }

  // Helper function to randomly pick tags
  private getRandomTags(): string[] {
    const tagCount = Math.floor(Math.random() * 3) + 1; // Randomly pick 1 to 3 tags
    const selectedTags: string[] = [];

    // Randomly select tags from tagData
    for (let i = 0; i < tagCount; i++) {
      const randomTag = tagData[Math.floor(Math.random() * tagData.length)];
      if (!selectedTags.includes(randomTag.id)) {
        selectedTags.push(randomTag.id);
      }
    }

    return selectedTags;
  }

  // Generate some random comments for a given post
  private generateCommentsForPost(
    postId: string,
  ): { postId: string; username: string; title: string; content: string }[] {
    const commentCount = Math.floor(Math.random() * 5) + 1; // Generate between 1 and 5 comments
    const comments: {
      postId: string;
      username: string;
      title: string;
      content: string;
    }[] = [];

    for (let i = 0; i < commentCount; i++) {
      comments.push({
        postId,
        username: this.getRandomUsername(),
        title: `Comment title #${i + 1}`,
        content: `This is a random comment #${i + 1} for post ${postId}`,
      });
    }

    return comments;
  }
}
