import { Injectable } from '@nestjs/common';
import { ID } from 'src/types/CommonTypes';
import { IHotelRoomService } from './interfaces/IHotelRoomService';
import { SearchRoomsParams } from './interfaces/SearchRoomsParams';
import { HotelRoom } from './schemas/hotel-room.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HotelRoomDto } from './dto/hotel-room.dto';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name)
        private hotelRoomModel: Model<HotelRoom>,
    ) {}

    create(hotel: HotelRoomDto): Promise<HotelRoom> {
        const newHotelRoom = this.hotelRoomModel.create(hotel);

        return newHotelRoom;
    }

    findById(id: ID): Promise<HotelRoom> {
        console.log(id);
        const hotelRoom = this.hotelRoomModel.findById(id);

        return hotelRoom;
    }

    search(params: SearchRoomsParams): Promise<HotelRoom[]> {
        // eslint-disable-next-line prefer-const
        let { limit, offset, hotelId, isEnabled } = params;

        limit = limit || 5;
        offset = offset || 0;
        hotelId = hotelId || '';

        const query: any = {};

        if (isEnabled) query.isEnabled = isEnabled;
        if (hotelId) query._id = hotelId;

        console.log(query);

        const hotelRooms = this.hotelRoomModel
            .find(query)
            .skip(offset)
            .limit(limit);

        return hotelRooms;
    }

    async update(id: ID, data: HotelRoomDto): Promise<HotelRoom> {
        const updatedHotelRoom = await this.hotelRoomModel
            .findByIdAndUpdate(id, data, { new: true })
            .lean();

        return updatedHotelRoom;
    }
}
