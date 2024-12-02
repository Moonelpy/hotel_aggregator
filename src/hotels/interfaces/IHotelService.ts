import { Hotel } from '../schemas/hotel.schema';
import { ID } from '../../types/CommonTypes';
import { SearchHotelParams } from './SearchHotelParams';
import { UpdateHotelParams } from './UpdateHotelParams';
import { HotelDto } from '../dto/hotel.dto';

export interface IHotelService {
    create(hotel: HotelDto): Promise<Hotel>;
    findById(id: ID): Promise<Hotel>;
    search(params: SearchHotelParams): Promise<Hotel[]>;
    update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
