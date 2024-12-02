import { ID } from '../../types/CommonTypes';

export interface SearchRoomsParams {
    limit: number;
    offset: number;
    hotelId: ID;
    isEnabled?: boolean;
}
