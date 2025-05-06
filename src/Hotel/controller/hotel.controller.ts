import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  
  @Post('/')
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);  
  }

  
  @Get('/')
  async getAllHotels() {
    return this.hotelService.getAllHotels();  
  }

  
  @Get('/:id')
  async getHotelById(@Param('id') id: string) {
    return this.hotelService.getHotelById(id);  
  }

  
  @Put('/:id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelService.updateHotel(id, updateHotelDto);  
  }

  
  @Delete('/:id')
  async deleteHotel(@Param('id') id: string) {
    return this.hotelService.deleteHotel(id);  
  }

  
  @Post('/rooms/')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.hotelService.createRoom(createRoomDto);  
  }

  @Get('/rooms/:id')  
async getRoomById(@Param('id') id: string) {
  return this.hotelService.getRoomById(id);  
}

  @Get('/rooms')
  async getAllRooms() {
    return this.hotelService.getAllRooms();  
  }

  @Delete('/rooms/:id')
  async deleteRoom(@Param('id') id: string) {
    return this.hotelService.deleteRoom(id);  
  }

  
  @Post('/reservations/')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.hotelService.createReservation(createReservationDto);  
  }

  
  @Get('/reservations')
  async getAllReservations() {
    return this.hotelService.getAllReservations();  
  }

  @Delete('/reservations/:id')
  async deleteReservation(@Param('id') id: string) {
    return this.hotelService.deleteReservation(id);  
  }
}