import { PartialType } from '@nestjs/mapped-types';
import { CreateBookmarkDto } from './create-bookmark.dto';
import { IsOptional, IsString } from "class-validator"

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {

    @IsOptional()
    @IsString()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    link?: string
}

