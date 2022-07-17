import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsService } from './posts/posts.service';
import { AuthorsService } from './authors/authors.service';
import { PostsModule } from './posts/posts.module';
import { AuthorsModule } from './authors/authors.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // schema's folder
      autoSchemaFile: true, // schema generation on the fly
      sortSchema: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    AuthorsModule,
  ],
  providers: [PostsService, AuthorsService],
})
export class AppModule {}
