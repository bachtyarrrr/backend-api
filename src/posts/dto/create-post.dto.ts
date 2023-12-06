import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
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
