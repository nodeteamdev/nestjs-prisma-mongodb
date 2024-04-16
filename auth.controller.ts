// auth.controller.ts

import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    // This method will handle the login process
    // Here you should call the AuthService to validate the user's credentials (email and OTP)
    // If valid, you can generate and set the session/cookie
    // If invalid, you can return an appropriate error response

    return req.user; // This will return the validated user
  }

  @UseGuards(LocalAuthGuard)
  @Post('otp')
  async sendOtp(@Request() req) {
    // This method will handle the request to send OTP to the user's email
    // You can use this endpoint to send OTP to the user's email before logging in

    const { email } = req.body;
    await this.authService.sendOtp(email);
    return { message: 'OTP sent successfully' };
  }
}