import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(
    userId: number,
    createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prismaService.bookmarks.create({
      data: {
        userid: userId,
        ...createBookmarkDto
      }
    })
    return bookmark;
  }

  async findAll(userId: number) {
    let bookmarks = await this.prismaService.bookmarks.findMany({
      where: {
        userid: userId
      }
    })
    return bookmarks;
  }

  async findOne(userId: number, id: number) {
    let Bookmark = await this.prismaService.bookmarks.findFirst({
      where: {
        userid: userId,
        id: id
      }
    })
    if (!Bookmark) {
      return { msg: "No bookmark found" }
    } else {
      return Bookmark;
    }
  }

  async update(id: number, updateBookmarkDto: UpdateBookmarkDto, userId: number) {
    let Bookmark = await this.prismaService.bookmarks.update({
      where: {
        userid: userId,
        id: id
      },
      data: {
        ...updateBookmarkDto
      }
    })
    if (!Bookmark) {
      return { msg: "No bookmark found to update" }
    } else {
      return Bookmark;
    }
  }

  async remove(id: number, userId: number) {
    let Bookmark = await this.prismaService.bookmarks.delete({
      where: {
        userid: userId,
        id: id
      }
    })
    if (!Bookmark) {
      return { msg: "No bookmark found to delete" }
    } else {
      return { msg: "bookmark deleted" }
    }
  }
}
