import { ID } from 'src/types/CommonTypes';
import { SendMessageDto } from '../dto/SendMessageDto';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/support-request.schema';
import { GetChatListParams } from './GetChatListParams';

export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;

    sendMessage(data: SendMessageDto): Promise<Message>;

    getMessages(supportRequest: ID): Promise<Message[]>;

    subscribe(
        handler: (supportRequest: string, message: Message) => void,
    ): () => void;
}
