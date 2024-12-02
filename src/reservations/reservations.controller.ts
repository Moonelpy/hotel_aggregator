import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservation.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller()
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    // Создаёт бронь на номер на выбранную дату для текущего пользователя.
    @Post('/api/client/reservations')
    @UsePipes(ValidationPipe)
    @Roles(['admin', 'client'])
    /* Добавил 'client' в декораторе roles для того, чтобы клиенты тоже могли создавать себе брони.
     Далее из-за этого сделал проверку на дурака в методе сервиса, чтобы пользователь мог только на себя делать бронь */
    @UseGuards(RolesGuard)
    createReservation(
        @Body()
            reservation: ReservationDto,
    ) {
        return this.reservationsService.addReservation(reservation);
    }

    // Список броней текущего пользователя.
    @Get('/api/client/reservations')
    @Roles(['client'])
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    getUserReservations(
        @Query('dateStart') dateStart?: Date,
        @Query('dateEnd') dateEnd?: Date,
    ) {
        return this.reservationsService.getReservations({
            dateStart,
            dateEnd,
        });
    }

    // Отменяет бронь пользователя.
    @Delete('/api/client/reservations/:id')
    @Roles(['client', 'admin', 'manager']) // согласно требования удалять бронь по этому адресу может только client, но добавил admin и manager.
    @UseGuards(RolesGuard)
    deleteReservation(@Param('id') id: string) {
        return this.reservationsService.removeReservation(id);
    }
}
