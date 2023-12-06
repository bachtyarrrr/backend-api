import { Controller, Get, Request, UseGuards, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    const userId = req.user.sub;

    return this.prismaService.post.create({
      data:{
        caption : createPostDto.caption,
        tags : createPostDto.tags,
        image:  createPostDto.image,
        authorId: userId
      }
    });
  }

  
  @Get()
  async getAllPost() {
    return this.prismaService.post.findMany()
  }

  @Get('user')
  async getPostByUser(@Request() req) {
    return this.prismaService.post.findMany({where:{authorId:req.user.sub} });
  }

  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({data:updatePostDto, where: {id}})
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.prismaService.post.delete({where: {id}});
  }

  @Post('like/:id')
  async postLike(@Request() req, @Param('id') id: string) {
    return this.prismaService.postLike.create({
      data:{
        userId: req.user.sub,
        postId: parseInt(id)
      }
    });
  }

  @Delete('dislike/:id')
  async deleteLike(@Request() req, @Param('id') id: string) {
    return this.prismaService.postLike.deleteMany({where: {
      userId: req.user.sub,
      postId: parseInt(id)
    }});
  }

  
}
