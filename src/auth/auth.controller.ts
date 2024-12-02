import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { LocalAuthGuard } from './local.auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/api/auth/login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return req.user;
    }

    // роут для тестов
    @Get('/api/auth/test')
    @Roles(['manager', 'admin'])
    @UseGuards(RolesGuard)
    test(@Request() req) {
        return req.user;
    }

    @Post('/api/auth/logout')
    logout(@Request() req): any {
        req.session.destroy();
        return { msg: 'The user session has ended' };
    }
}
