import { BadRequestException,Inject, Scope, Injectable } from '@nestjs/common';
import { IReservation } from './interfaces/IReservation';
import { ID } from 'src/types/CommonTypes';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationSearchOptions } from './interfaces/IReservationSearchOptions';
import { Reservation } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getMskDate } from 'src/helpers/dateHelper';
import { REQUEST } from '@nestjs/core';


@Injectable({ scope: Scope.REQUEST }) // для получения контекста по юзеру
export class ReservationsService implements IReservation {
    constructor(
        @InjectModel(Reservation.name)
        private reservationModel: Model<Reservation>,
        @Inject(REQUEST) // для получения контекста по юзеру
        private readonly request: Request
    ) {}
    async addReservation(reservation: ReservationDto): Promise<Reservation> {
        const dateStartMsk = new Date(reservation.dateStart);
        const dateEndMsk = new Date(reservation.dateEnd);
        const dateNowMsk = getMskDate();

        // проверки на корректность переданных дат
        const isDateStartFuture = dateStartMsk > dateNowMsk;
        const isDateEndFuture = dateEndMsk > dateNowMsk;
        const isDateStartBeforeDateEnd = dateStartMsk < dateEndMsk;
        const isNotDateStartSameDateEnd = dateStartMsk !== dateEndMsk;

        const roomReservations = await this.reservationModel
            .find({ roomId: reservation.roomId })
            .lean();

        // проверка на то, что если client, то только на себя бронь
        // @ts-ignore
        const user = this.request.user
        if (reservation.userId !== user.userId) {
            throw new BadRequestException('Клиент может забронировать номер только на себя')
        }

        // проверка что комнаты не заняты
        roomReservations.map((reservation) => {
            if (
                (dateStartMsk >= reservation.dateStart &&
                    dateStartMsk <= reservation.dateEnd) ||
                (dateEndMsk >= reservation.dateStart &&
                    dateEndMsk <= reservation.dateEnd) ||
                (dateStartMsk <= reservation.dateStart &&
                    dateEndMsk >= reservation.dateEnd)
            ) {
                throw new BadRequestException('Даты заняты');
            }
        });

        if (
            isDateStartFuture &&
            isDateEndFuture &&
            isDateStartBeforeDateEnd &&
            isNotDateStartSameDateEnd
        ) {
            const newReservation = this.reservationModel.create(reservation);
            return newReservation;
        } else {
            throw new BadRequestException('Некорректные даты');
        }
    }

    async removeReservation(id: ID): Promise<void> {
        await this.reservationModel.findByIdAndDelete(id);
        return;
    }

    getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
        // удалил userid, мы получаем его теперь из контекста
        const { dateStart, dateEnd } = filter;

        // @ts-ignore
        const userId = this.request.user.userId
        if (!userId) {
            throw new BadRequestException('Не удалось идентифицировать пользователя')
        }

        const query: any = {};

        if (userId) query.userId = userId;
        if (dateStart) query.dateStart = { $gte: dateStart };
        if (dateEnd) query.dateEnd = { $lte: dateEnd };

        const reservations = this.reservationModel.find(query);

        return reservations;
    }
}
