import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query, UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './SupportRequestClientService';
import { SupportRequestEmployeeService } from './SupportRequestEmployeeService';
import { CreateSupportRequestDto } from './dto/CreateSupportRequestDto';

import { SendMessageDto } from './dto/SendMessageDto';
import { MarkMessagesAsReadDto } from './dto/MarkMessagesAsReadDto';
import {Roles} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/roles.guard";

@Controller()
export class SupportController {
    constructor(
        private readonly supportRequestService: SupportRequestService,
        private readonly supportRequestClientService: SupportRequestClientService,
        private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    ) {}

    // Позволяет пользователю с ролью client создать обращение в техподдержку
    @Post('/api/client/support-requests')
    @UsePipes(ValidationPipe)
    @Roles(['client'])
    @UseGuards(RolesGuard)
    createSupportRequest(@Body() data: CreateSupportRequestDto) {
        return this.supportRequestClientService.createSupportRequest(data);
    }

    // Позволяет пользователю с ролью client получить список обращений для текущего пользователя.
    @Get('/api/client/support-requests')
    @UsePipes(ValidationPipe)
    @Roles(['client'])
    @UseGuards(RolesGuard)
    getSupportRequestsForClient(
        @Query('user') user?: string,
        @Query('isActive') isActive?: boolean,
    ) {
        return this.supportRequestService.findSupportRequests({ user, isActive });
    }

    // Позволяет пользователю с ролью manager получить список обращений от клиентов.
    @Get('/api/manager/support-requests')
    @UsePipes(ValidationPipe)
    @Roles(['client'])
    @UseGuards(RolesGuard)
    getSupportRequestsForManager(
        @Query('user') user?: string,
        @Query('isActive') isActive?: boolean,
    ) {
        return this.supportRequestService.findSupportRequests({ user, isActive });
    }

    // Позволяет пользователю с ролью manager или client получить все сообщения из чата.
    @Get('/api/common/support-requests/:id/messages')
    @UsePipes(ValidationPipe)
    getMessageFromChat(@Param('id') id: string) {
        return this.supportRequestService.getMessages(id);
    }

    // Позволяет пользователю с ролью manager или client отправлять сообщения в чат.
    // Передал id запроса в боди, просто так удобнее
    @Post('/api/common/support-requests/messages')
    @UsePipes(ValidationPipe)
    sendMessageToChat(@Body() message: SendMessageDto) {
        return this.supportRequestService.sendMessage(message);
    }

    // Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.
    // Тоже передал айди обращения в боди. Мне кажется так удобнее пользоваться методом
    @Post('/api/common/support-requests/messages/read')
    @UsePipes(ValidationPipe)
    readMessage(@Body() body: MarkMessagesAsReadDto) {
        return this.supportRequestEmployeeService.markMessagesAsRead(body);
    }
}
