import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reservation.name, schema: ReservationSchema },
        ]),
        AuthModule,
        UsersModule,
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService, RolesGuard],
})
export class ReservationsModule {}
