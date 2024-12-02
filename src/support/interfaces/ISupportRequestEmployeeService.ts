import { ID } from 'src/types/CommonTypes';
import { MarkMessagesAsReadDto } from '../dto/MarkMessagesAsReadDto';

export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto);

    getUnreadCount(supportRequest: ID): Promise<number>;

    closeRequest(supportRequest: ID): Promise<void>;
}
