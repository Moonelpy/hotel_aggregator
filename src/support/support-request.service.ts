import { Injectable } from '@nestjs/common';
import { ISupportRequestService } from './interfaces/ISupportRequestService';
import { ID } from 'src/types/CommonTypes';
import { SendMessageDto } from './dto/SendMessageDto';
import { GetChatListParams } from './interfaces/GetChatListParams';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getMskDate } from 'src/helpers/dateHelper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
    constructor(
        @InjectModel(SupportRequest.name)
        private supportRequest: Model<SupportRequest>,

        @InjectModel(Message.name)
        private message: Model<Message>,

        private eventEmitter: EventEmitter2,
    ) {}

    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const { user, isActive } = params;

        const query: any = {};

        if (user) query.user = user;

        if (isActive) query.isActive = isActive;

        const supportRequests = this.supportRequest.find(query);

        return supportRequests;
    }

    async sendMessage(data: SendMessageDto): Promise<Message> {
        const messageData = {
            author: data.author,
            text: data.text,
            sentAt: getMskDate(),
        };
        const message = await this.message.create(messageData);

        await this.supportRequest
            .updateOne(
                { _id: data.supportRequest },
                { $push: { messages: message._id } },
            )
            .exec();

        this.eventEmitter.emit('message', {
            supportRequest: data.supportRequest,
            message: message,
        });

        return message;
    }

    async getMessages(supportRequestID: ID): Promise<any> {
        const supportRequest = await this.supportRequest
            .findById(supportRequestID)
            .populate({
                path: 'messages',
                select: 'createdAt text readAt',
                populate: { path: 'author', select: 'id name' },
            })
            .lean();

        return supportRequest.messages;
    }

    subscribe(
        handler: (supportRequest: string, message: Message) => void,
    ): () => void {
        this.eventEmitter.on('message', handler);
        return;
    }
}
