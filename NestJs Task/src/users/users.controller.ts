import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { getUser, getUserId } from '.././auth/decorator/auth.decorator';
import { User } from '../auth/dto/auth.dto';
import { guard } from '../auth/guard/auth.guard';
import { editUser, emailDto, resetDto } from './dto/editUser.dto';
import { UsersService } from './users.service';
import { EmailService } from './email.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly emailService: EmailService
    ) { }

    @Get('me')
    @UseGuards(guard)
    getOne(@getUser() user: User) {
        return user;
    }

    @Patch('update')
    @UseGuards(guard)
    editOne(@getUserId() userId: number, @Body() dto: editUser) {
        return this.userService.updateUser(userId, dto);
    }

    @Post('reset')
    async sendEmail(@Body() data: emailDto) {
        return this.emailService.sendEmail(data)
    }

    @Patch('reset')
    resetPass(@Body() resetInfo: resetDto) {
        return this.userService.resetpass(resetInfo)
    }
}
