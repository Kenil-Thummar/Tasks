import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { getUserId } from 'src/auth/decorator/auth.decorator';
import { guard } from 'src/auth/guard/auth.guard';
import { CONSTANTS } from 'src/users/entities/users.roles';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(guard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post("create")
  create(
    @getUserId() userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(userId, createBookmarkDto);
  }

  @Get("getall")
  findAll(@getUserId() userId: number) {
    return this.bookmarksService.findAll(userId);
  }

  @Get(':id')
  findOne(@getUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.bookmarksService.findOne(userId, id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookmarkDto: UpdateBookmarkDto, @getUserId() userId: number) {
    return this.bookmarksService.update(+id, updateBookmarkDto, userId);
  }


  @Delete(':id')
  @UseGuards(new AuthGuard(CONSTANTS.ROLES.ADMIN))
  remove(@Param('id') id: string, @getUserId() userId: number) {
    return this.bookmarksService.remove(+id, userId);
  }
}
