import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { emailDto } from './dto/editUser.dto';

@Injectable()
export class EmailService {
    private transporter;

    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService
    ) {
        const emailConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        };

        // Check if the email configuration is provided
        if (emailConfig.auth.user && emailConfig.auth.pass) {
            this.transporter = nodemailer.createTransport(emailConfig);
        } else {
            console.error('Email configuration is incomplete');
        }
    }

    async sendEmail(email: emailDto): Promise<string> {
        if (!this.transporter) {
            console.error('Email transporter is not initialized');
            return;
        }
        try {
            const userEmail = email.email
            const user = await this.prismaService.users.findUnique({
                where: { email: userEmail },
            });

            if (!user) {
                return "No user found"
            }

            const resetToken = await this.authService.resetToken(user.id, user.email)

            const mailOptions = {
                from: this.configService.get('EMAIL_USER'),
                to: userEmail,
                subject: "Token to reset your password",
                text: `RESETTOKEN:-${resetToken.reset_token}`,
            };
            await this.transporter.sendMail(mailOptions);
            return "Your reset token has been sent to your Email succesfully"
        }
        catch (error) {
            console.error(error.message);
            return `${error.message}`
        }
    }
}
