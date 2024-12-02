import { ID } from 'src/types/CommonTypes';
import { CreateSupportRequestDto } from '../dto/CreateSupportRequestDto';
import { MarkMessagesAsReadDto } from '../dto/MarkMessagesAsReadDto';
import { SupportRequest } from '../schemas/support-request.schema';

export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

    markMessagesAsRead(params: MarkMessagesAsReadDto);

    getUnreadCount(supportRequest: ID): Promise<number>;
}
