import { Injectable } from '@nestjs/common';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  findAll({ authorId: number }): Post[] {
    return [
      {
        id: 1,
        title: 'Post 1',
        votes: 1,
      },
      {
        id: 2,
        title: 'Post 2',
        votes: 2,
      },
      {
        id: 3,
        title: 'Post 3',
        votes: 3,
      },
    ];
  }
}
