import { IsNotEmpty, IsString } from 'class-validator';

export class HotelDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
