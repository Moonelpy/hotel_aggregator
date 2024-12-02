import { ObjectId } from 'mongoose';

export interface IUpdateHotelRoomParams {
    hotel: ObjectId;

    description: string;

    images: string[];

    isEnabled: boolean;
}
