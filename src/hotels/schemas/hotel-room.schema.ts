import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hotel } from './hotel.schema';

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema({ timestamps: true })
export class HotelRoom {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
    hotel: Hotel;

    @Prop()
    description: string;

    @Prop({ default: [] })
    images: string[];

    @Prop({ required: true, default: true })
    isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
