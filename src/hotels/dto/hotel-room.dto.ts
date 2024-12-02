import {
    IsArray,
    IsBoolean,
    IsMongoId,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class HotelRoomDto {
    @IsNotEmpty()
    @IsMongoId()
    hotel: ObjectId;

    @IsString()
    description: string;

    @IsArray()
    images: string[];

    @IsBoolean()
    isEnabled?: boolean;
}
