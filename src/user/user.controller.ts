import { Body, Controller, Get, NotFoundException, UseGuards, InternalServerErrorException, Param, Post, Put, Delete } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  @Get()
  async getUser(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    const userFound = await this.userService.getUserById(Number(id))
    if (!userFound) throw new NotFoundException(" user stidak ada")
    return userFound
  }

  @Post()
  async postUser(
    @Body()
    userData: {
      email: string;
      username: string;
      name: string;
      password: string;
      photo: string;
    },
  ): Promise<UserModel> {
    const email = userData.email;
    const username = userData.username;
    const name = userData.name;
    const password = await bcrypt.hash(userData.password, 10);
    const photo = userData.photo;
    return this.userService.createUser({
      email,
      username,
      name,
      password,
      photo,
    });
  }

  @Put(':id')
    async updateUser(@Param('id') id: number, @Body() userData:  {email: string;
      username: string;
      name: string;
      password: string;
      photo: string;
    }): Promise<UserModel>{
      const { email, username, name, photo } = userData;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      try {
        return await this.userService.updateUser({
          where: { id: Number(id) },
          data: {
            email,
            username,
            name,
            password: hashedPassword,
            photo,
          },
        });
      } catch (error) {
        throw new NotFoundException('User tidak ada');
      }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        try {
            return await this.userService.deleteUser(Number(id))
        } catch (error) {
            throw new NotFoundException("User tidak ada")
        }
    }
}
