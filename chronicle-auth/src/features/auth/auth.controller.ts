import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'chronicle-auth',
      timestamp: new Date().toISOString()
    };
  }

  @Post('login')
  login(@Body() body: unknown) {
    return {
      message: 'Login endpoint - to be implemented',
      body
    };
  }

  @Post('register')
  register(@Body() body: unknown) {
    return {
      message: 'Register endpoint - to be implemented',
      body
    };
  }
}
