import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelService } from './service/hotel.service';
import { HotelController } from './controller/hotel.controller';
import { HotelRepository } from './model/repository/hotel.repository';
import { RoomRepository } from './model/repository/room.repository'; 
import { ReservationRepository } from './model/repository/reservation.repository'; 
import { Hotel } from './model/entity/hotel.entity';
import { Room } from './model/entity/room.entity';
import { Reservation } from './model/entity/reservation.entity';
import { UserModule } from '../User/user.module'
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../User/guard/guard'; 
import { UserRepository } from 'src/User/model/repository/user.repository';



@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Hotel, Room, Reservation,]), 
  ], 
  controllers: [HotelController],
  providers: [HotelService, RoomRepository, ReservationRepository, HotelRepository], 
})
export class HotelModule {}