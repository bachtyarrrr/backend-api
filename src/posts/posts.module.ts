import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, AuthModule]
})
export class PostsModule {}
