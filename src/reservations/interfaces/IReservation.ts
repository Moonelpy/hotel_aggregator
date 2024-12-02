import { ID } from 'src/types/CommonTypes';
import { ReservationDto } from '../dto/reservation.dto';
import { Reservation } from '../schemas/reservation.schema';
import { ReservationSearchOptions } from './IReservationSearchOptions';

export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>;
    removeReservation(id: ID): Promise<void>;
    getReservations(
        filter: ReservationSearchOptions,
    ): Promise<Array<Reservation>>;
}
