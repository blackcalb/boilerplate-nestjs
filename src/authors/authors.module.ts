import { Module } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  imports: [],
  providers: [AuthorsService, AuthorsResolver, PostsService],
})
export class AuthorsModule {}
