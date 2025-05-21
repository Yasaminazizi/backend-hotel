import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../model/entity/reservation.entity';
import { CreateReservationDto } from '../../dto/create-reservation.dto';
import { ReservationStatus } from '../enum/status.enum';
import {FilterReservationDto} from '../../dto/filter-reservation.dto'

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

  //for reserve by user reserv
  async getReservationById(id: string): Promise<Reservation | null> {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.hotel', 'hotel')
      .where('reservation.id = :id', { id })
      .getOne(); 
  }
  
  
  //for self user
  async getReservationsByUserId(userId: string, status?: ReservationStatus): Promise<Reservation[]> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.hotel', 'hotel')
      .where('reservation.userId = :userId', { userId });
  
    if (status) {
      query.andWhere('reservation.status = :status', { status });
    }
  
    return await query.getMany();
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

  
  async filterReservations(filter: FilterReservationDto): Promise<Reservation[]> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.hotel', 'hotel')
      .where('1=1');
  
    if (filter.userId) {
      console.log('Applying userId filter:', filter.userId);
      query.andWhere('reservation.userId = :userId', { userId: filter.userId });
    }
  
    if (filter.status) {
      console.log('Applying status filter:', filter.status);
      query.andWhere('reservation.status = :status', { status: filter.status });
    }
  
    if (filter.roomId) {
      query.andWhere('reservation.roomId = :roomId', { roomId: filter.roomId });
    }
  
    if (filter.hotelId) {
      query.andWhere('reservation.hotelId = :hotelId', { hotelId: filter.hotelId });
    }
  
    if (filter.startDate) {
      query.andWhere('reservation.checkInDate >= :startDate', { startDate: filter.startDate });
    }
  
    if (filter.endDate) {
      query.andWhere('reservation.checkOutDate <= :endDate', { endDate: filter.endDate });
    }
  
    const result = await query.getMany();
    console.log('Filtered result count:', result.length);
    return result;
  }
  
  
  //for method search
  async findOverlappingReservations(roomId: string, checkIn: Date, checkOut: Date): Promise<Reservation[]> {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.roomId = :roomId', { roomId })
      .andWhere('reservation.status = :status', { status: 'active' })  
      .andWhere('reservation.checkOutDate > :checkIn', { checkIn })
      .andWhere('reservation.checkInDate < :checkOut', { checkOut })
      .getMany();
  }

}