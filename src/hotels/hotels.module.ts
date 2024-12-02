import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Hotel.name, schema: HotelSchema },
            { name: HotelRoom.name, schema: HotelRoomSchema },
        ]),
        AuthModule,
        UsersModule,
        MulterModule.register({
            dest: './images',
        }),
    ],
    controllers: [HotelsController],
    providers: [HotelsService, HotelRoomService, RolesGuard],
})
export class HotelsModule {}
