import { ID } from 'src/types/CommonTypes';

export interface GetChatListParams {
    user?: ID | null;
    isActive: boolean;
}
