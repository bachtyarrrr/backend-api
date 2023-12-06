import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    caption: string;

    @IsNotEmpty()
    @IsString()
    tags: string

    @IsString()
    @IsNotEmpty()
    image: string
}
