import { IsISO8601, IsMongoId, IsNotEmpty } from 'class-validator';
import { ID } from '../../types/CommonTypes';

export class ReservationDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: ID;

    @IsNotEmpty()
    @IsMongoId()
    hotelId: ID;

    @IsNotEmpty()
    @IsMongoId()
    roomId: ID;

    @IsNotEmpty()
    @IsISO8601()
    dateStart: Date;

    @IsNotEmpty()
    @IsISO8601()
    dateEnd: Date;
}
