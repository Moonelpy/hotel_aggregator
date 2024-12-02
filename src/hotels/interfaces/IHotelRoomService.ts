import { HotelRoom } from '../schemas/hotel-room.schema';
import { ID } from 'src/types/CommonTypes';
import { SearchRoomsParams } from './SearchRoomsParams';
import { HotelRoomDto } from '../dto/hotel-room.dto';

export interface IHotelRoomService {
    create(data: HotelRoomDto): Promise<HotelRoom>;
    findById(id: ID): Promise<HotelRoom>;
    search(params: SearchRoomsParams): Promise<HotelRoom[]>;
    update(id: ID, hotel: HotelRoomDto): Promise<HotelRoom>;
}
