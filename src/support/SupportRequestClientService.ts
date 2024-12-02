import { Injectable } from '@nestjs/common';
import { ISupportRequestClientService } from './interfaces/ISupportRequestClientService';
import { ID } from 'src/types/CommonTypes';
import { CreateSupportRequestDto } from './dto/CreateSupportRequestDto';
import { MarkMessagesAsReadDto } from './dto/MarkMessagesAsReadDto';
import { SupportRequest } from './schemas/support-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { getMskDate } from 'src/helpers/dateHelper';

@Injectable()
export class SupportRequestClientService
    implements ISupportRequestClientService
{
    constructor(
        @InjectModel(SupportRequest.name)
        private supportRequest: Model<SupportRequest>,

        @InjectModel(Message.name)
        private message: Model<Message>,
    ) {}

    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
        const supportRequest = this.supportRequest.create(data);

        return supportRequest;
    }

    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        const { user, supportRequest, createdBefore } = params;

        // Найдем соответствующий SupportRequest
        const supportReq = await this.supportRequest
            .findById(supportRequest)
            .exec();

        // Обновим все сообщения, которые были отправлены не пользователем и до определенной даты
        await this.message
            .updateMany(
                {
                    _id: { $in: supportReq.messages },
                    author: { $ne: user },
                    sentAt: { $lte: createdBefore },
                    readAt: { $eq: null },
                },
                { readAt: getMskDate() },
            )
            .exec();
    }

    async getUnreadCount(supportRequestId: ID): Promise<number> {
        const supportRequest = await this.supportRequest
            .findById(supportRequestId)
            .populate({
                path: 'messages',
                populate: { path: 'author' },
            })
            .exec();

        const { messages } = supportRequest;
        const count = messages.reduce((acc, message) => {
            if (message.author.role !== 'client' && !message.readAt) return acc + 1;
            return acc;
        }, 0);

        return count;
    }
}
