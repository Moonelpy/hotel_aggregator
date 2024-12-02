import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { User } from '../../users/schemas/user.schema';
import { HotelRoom } from '../../hotels/schemas/hotel-room.schema';

export type ReservationDocument = HydratedDocument<Hotel>;

@Schema({ timestamps: true })
export class Reservation {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    })
    userId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
    hotelId: Hotel;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelRoom',
        required: true,
    })
    roomId: HotelRoom;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
