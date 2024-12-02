import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Позволяет пользователю с ролью admin создать пользователя в системе.
    @Post('/api/admin/users')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    register(@Body() user: RegisterUserDto) {
        return this.usersService.create(user);
    }

    // Позволяет пользователю с ролью admin получить пользователей в системе.
    @Get('/api/admin/users')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    getUsersListByAdmin(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('contactPhone') contactPhone?: string,
    ) {
        return this.usersService.findAll({
            limit,
            offset,
            name,
            email,
            contactPhone,
        });
    }

    // Позволяет пользователю с manager получить пользователей в системе.
    @Get('/api/manager/users')
    @UsePipes(ValidationPipe)
    @Roles(['manager'])
    @UseGuards(RolesGuard)
    getUsersListByManager(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('contactPhone') contactPhone?: string,
    ) {
        return this.usersService.findAll({
            limit,
            offset,
            name,
            email,
            contactPhone,
        });
    }

    // неиспользуемые ручки
    @Get('/api/admin/user-by-id/:id')
    @UsePipes(ValidationPipe)
    getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Get('/api/admin/user-by-email')
    @UsePipes(ValidationPipe)
    getUserByEmail(@Query('email') email: string) {
        return this.usersService.findByEmail(email);
    }
}
