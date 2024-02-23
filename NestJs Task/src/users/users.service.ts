
import { Injectable } from '@nestjs/common';
import { editUser, resetDto } from './dto/editUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService,
        private readonly config: ConfigService,) { }
    async updateUser(userId: number, dto: editUser) {
        try {
            // Update the user in the database
            const user = await this.prismaService.users.update({
                where: {
                    id: userId
                },
                data: {
                    ...dto
                }
            });

            return user;
        } catch (error) {
            // Check if the error is related to user not found
            if (error.code === "P2025") {
                return "User not found. Unable to update.";
            }

            // Handle other errors or rethrow the original error
            throw error;
        }
    }

    async resetpass(resetinfo: resetDto) {
        try {
            // Verify reset token
            const checkResetToken = jwt.verify(resetinfo.reset_tokken, this.config.get("RESET_SECRET"))
            const userid: number = checkResetToken["sub"] as unknown as number

            // Hash the new password
            const hash = bcrypt.hashSync(resetinfo.password, 10);

            // Update user password in the database
            await this.prismaService.users.update({
                where: { id: userid },
                data: { hash: hash },
            });

            // Return success message
            return { success: true, message: "Successfully password has been updated" };
        } catch (error) {
            // Handle errors and return failure message
            console.error("Password reset failed:", error.message);
            return { success: false, message: "Password reset failed. Please try again." };
        }
    }


}
