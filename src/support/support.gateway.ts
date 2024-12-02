import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { SupportRequestService } from './support-request.service';
import { Server } from 'socket.io';
import { SendMessageDto } from './dto/SendMessageDto';

@WebSocketGateway(3001, { cors: true })
export class SupportGateway {
    constructor(private readonly supportRequestService: SupportRequestService) {}
    @WebSocketServer()
    server: Server;

    // тестирование сокета
    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: any | string): void {
        // почему так ответ приходит на клиент
        this.server.emit('events', data);
    }

    // просто так сделал и через сокет добавление сообщения
    @SubscribeMessage('sendMessage')
    async sendMessageToChat(@MessageBody() message: SendMessageDto) {
        await this.supportRequestService.sendMessage(message);
    }

    // Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.
    // message: subscribeToChat payload: chatId
    // с трудом задебажил это и заставил работать. Было очень сложно
    @SubscribeMessage('subscribeToChat')
    async subscribeToChat(@MessageBody() body: { chatId: string }) {
        console.log('has message');
        this.supportRequestService.subscribe((chatData: any) => {
            console.log('message', chatData.message, chatData.supportRequest);
            if (chatData.supportRequest === body.chatId) {
                this.server.emit('message', chatData.message);
            }
        });
    }

    // // то что ниже не используется
    // @SubscribeMessage('findOneComment')
    // findOneComment(@MessageBody() commentId: string) {
    //   return this.supportRequestService.findOneComment(commentId);
    // }

    // @SubscribeMessage('updateComment')
    // updateComment(@MessageBody() updateComment: CommentDto) {
    //   return this.supportRequestService.updateComment(
    //     updateComment.commentId,
    //     updateComment,
    //   );
    // }

    // @SubscribeMessage('removeComment')
    // deleteComments(@MessageBody() commentId: string) {
    //   return this.supportRequestService.deleteComments(commentId);
    // }
}
