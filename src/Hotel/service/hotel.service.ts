import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomRepository } from '../model/repository/room.repository';
import { ReservationRepository } from '../model/repository/reservation.repository';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Hotel } from '../model/entity/hotel.entity';
import { Room } from '../model/entity/room.entity';
import { Reservation } from '../model/entity/reservation.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HotelRepository } from '../model/repository/hotel.repository';
import { UserRepository } from '../../User/model/repository/user.repository';  
import { BadRequestException } from '@nestjs/common';
import { SearchRoomDto } from '../dto/search-room.dto';
import { ReservationStatus } from '../model/enum/status.enum';
import {FilterReservationDto} from '../dto/filter-reservation.dto'
@Injectable()
export class HotelService {
  constructor(
    private readonly hotelRepository: HotelRepository,
    private readonly roomRepository: RoomRepository,
    private readonly reservationRepository: ReservationRepository,
     private readonly userRepository: UserRepository,
      
  ) {}

  //All methods for Hotel:
  async createHotel(createHotelDto: CreateHotelDto): Promise<Hotel> {
    try {
      return await this.hotelRepository.createHotel(createHotelDto);  
    } catch (error) {
      throw new HttpException('Error creating hotel', HttpStatus.BAD_REQUEST);
    }
  }
  
  async getAllHotels(): Promise<Hotel[]> {
    try {
      const hotels = await this.hotelRepository.getAllHotels();
      if (!hotels || hotels.length === 0) {
        throw new HttpException('No hotels found', HttpStatus.NOT_FOUND);
      }
      return hotels;
    } catch (error) {
      throw new HttpException('Error fetching hotels', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    try {
      const hotel = await this.hotelRepository.getHotelById(id);
      if (!hotel) {
        throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
      }
      return hotel;
    } catch (error) {
      throw new HttpException('Error fetching hotel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 
  async updateHotel(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel | null> {
    try {
      const hotel = await this.hotelRepository.getHotelById(id);
      if (!hotel) {
        throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
      }
      return await this.hotelRepository.updateHotel(id, updateHotelDto);
    } catch (error) {
      throw new HttpException('Error updating hotel', HttpStatus.BAD_REQUEST);
    }
  }

  
  async deleteHotel(id: string): Promise<void> {
    try {
      const hotel = await this.hotelRepository.getHotelById(id);
      if (!hotel) {
        throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
      }
      await this.hotelRepository.deleteHotel(id);
    } catch (error) {
      throw new HttpException('Error deleting hotel', HttpStatus.BAD_REQUEST);
    }
  }

  //All methods for Rooms:

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      return await this.roomRepository.createRoom(createRoomDto);
    } catch (error) {
      throw new HttpException('Error creating room', HttpStatus.BAD_REQUEST);
    }
  }

  
async getAllRooms(): Promise<Room[]> {
  try {
    return await this.roomRepository.getAllRooms();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new HttpException('Error fetching rooms', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
  
  async getRoomById(id: string): Promise<Room | null> {
    try {
      const room = await this.roomRepository.getRoomById(id);
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      return room;
    } catch (error) {
      throw new HttpException('Error fetching room', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async deleteRoom(id: string): Promise<void> {
    try {
      const room = await this.roomRepository.getRoomById(id);
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      await this.roomRepository.deleteRoom(id);
    } catch (error) {
      throw new HttpException('Error deleting room', HttpStatus.BAD_REQUEST);
    }
  }

  //All methods for Reservations:
  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    try {
      
      const userId = createReservationDto.userId;

      if (!userId) {
        throw new HttpException('Unauthorized: userId missing from token', HttpStatus.UNAUTHORIZED);
      }

     
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return await this.reservationRepository.createReservation(createReservationDto);
    }  catch (error) {
      console.error('Reservation creation error:', error); 
      throw new BadRequestException('Error creating reservation');
    }
}
  
  async getAllReservations(): Promise<Reservation[]> {
    try {
      return await this.reservationRepository.getAllReservations();
    } catch (error) {
      throw new HttpException('Error fetching reservations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  async getReservationById(id: string, userId: string): Promise<Reservation> {
    try {
      console.log('Fetching reservation with id:', id);
      const reservation = await this.reservationRepository.getReservationById(id);
  
      if (!reservation) {
        throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
      }
  
      
      if (reservation.user?.id !== userId) {
        throw new HttpException('Forbidden: You do not have access to this reservation', HttpStatus.FORBIDDEN);
      }
  
      return reservation;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw new HttpException('Error fetching reservation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  async deleteReservation(id: string): Promise<void> {
    try {
      const reservation = await this.reservationRepository.getReservationById(id);
      if (!reservation) {
        throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
      }
      await this.reservationRepository.deleteReservation(id);
    } catch (error) {
      throw new HttpException('Error deleting reservation', HttpStatus.BAD_REQUEST);
    }
  }

  //meethods for Admin in reservation:
  async cancelReservation(id: string) {
    const reservation = await this.reservationRepository.getReservationById(id);
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
    reservation.status = ReservationStatus.CANCELED;
    return this.reservationRepository.updateReservation(id, reservation);
  }
  
  async checkoutReservation(id: string) {
    const reservation = await this.reservationRepository.getReservationById(id);
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
    reservation.status = ReservationStatus.CHECKED_OUT;
    return this.reservationRepository.updateReservation(id, reservation);
  }


  async getAllUserReservations(userId: string, status?: ReservationStatus): Promise<Reservation[]> {
    try {
      return await this.reservationRepository.getReservationsByUserId(userId, status);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw new HttpException('Error fetching reservation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async filterReservationsByAdmin(filter: FilterReservationDto): Promise<Reservation[]> {
    try {
      console.log('FILTER RECEIVED:', filter);
      const results = await this.reservationRepository.filterReservations(filter);
      console.log('FILTER RESULTS:', results);
  
      return results;
    } catch (error) {
      console.error('Error filtering reservations:', error);
      throw new HttpException('مشکلی در فیلتر رزروها رخ داد', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  //search methods:
  async searchRoomAvailability(dto: SearchRoomDto): Promise<{ available: boolean; message: string }> {
    const { roomId, checkIn, checkOut } = dto;
  
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
  
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
  
    if (checkInDate >= checkOutDate) {
      throw new HttpException('Invalid date range', HttpStatus.BAD_REQUEST);
    }
  
    const overlapping = await this.reservationRepository.findOverlappingReservations(
      roomId,
      checkInDate,
      checkOutDate
    );
  
    if (overlapping.length > 0) {
      throw new HttpException('Room is already reserved in the selected date range', HttpStatus.CONFLICT);
    }
  
    return {
      available: true,
      message: 'Room is available for reservation',
    };
  }

}