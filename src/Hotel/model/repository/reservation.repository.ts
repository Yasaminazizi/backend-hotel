import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../model/entity/reservation.entity';
import { CreateReservationDto } from '../../dto/create-reservation.dto';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  
  async getReservationById(id: string): Promise<Reservation | null> {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.hotel', 'hotel')
      .where('reservation.id = :id', { id })
      .getOne(); // یا getMany() بسته به نیاز شما
  }



  async updateReservation(id: string, updatedData: CreateReservationDto): Promise<Reservation | null> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) return null;
    this.reservationRepository.merge(reservation, updatedData);
    return await this.reservationRepository.save(reservation);
  }

  async deleteReservation(id: string): Promise<void> {
    await this.reservationRepository.softDelete(id);
  }

  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationRepository.find();
  }
}