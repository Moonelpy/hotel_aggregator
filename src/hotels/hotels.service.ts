import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IHotelService } from './interfaces/IHotelService';
import { ID } from 'src/types/CommonTypes';
import { SearchHotelParams } from './interfaces/SearchHotelParams';
import { UpdateHotelParams } from './interfaces/UpdateHotelParams';
import { Hotel } from './schemas/hotel.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HotelDto } from './dto/hotel.dto';

@Injectable()
export class HotelsService implements IHotelService {
    constructor(
        @InjectModel(Hotel.name)
        private hotelModel: Model<Hotel>,
    ) {}

    async create(hotel: HotelDto): Promise<Hotel> {
        const newHotel = await this.hotelModel.create(hotel);

        return newHotel;
    }

    findById(id: ID): Promise<Hotel> {
        const hotel = this.hotelModel.findById(id);

        return hotel;
    }

    search(params: SearchHotelParams): Promise<Hotel[]> {
        let { limit, offset, title } = params;

        limit = limit || 5;
        offset = offset || 0;
        title = title || '';

        const query: any = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        try {
            const hotels = this.hotelModel.find(query).limit(limit).skip(offset);

            return hotels;
        } catch (e) {
            throw new InternalServerErrorException(
                'Не удалось выполнить поиск по отелям',
            );
        }
    }

    update(id: ID, hotel: UpdateHotelParams): Promise<Hotel> {
        const updatedHotel = this.hotelModel.findByIdAndUpdate(id, hotel);

        return updatedHotel;
    }
}
