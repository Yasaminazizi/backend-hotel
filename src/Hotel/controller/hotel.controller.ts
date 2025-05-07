import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  //check
  @Post('/')
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);  
  }

  //check
  @Get('/')
  async getAllHotels() {
    return this.hotelService.getAllHotels();  
  }

  //check
  @Get('/:id')
  async getHotelById(@Param('id') id: string) {
    return this.hotelService.getHotelById(id);  
  }

  //check
  
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

  //check
  @Post('/rooms/')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.hotelService.createRoom(createRoomDto);  
  }

  //check

  @Get('/rooms/:id')  
async getRoomById(@Param('id') id: string) {
  return this.hotelService.getRoomById(id);  
}

  @Get('/rooms')
  async getAllRooms() {
    return this.hotelService.getAllRooms();  
  }
//check
  @Delete('/rooms/:id')
  async deleteRoom(@Param('id') id: string) {
    return this.hotelService.deleteRoom(id);  
  }
//check
  
  @Post('/reservations/')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.hotelService.createReservation(createReservationDto);  
  }

  
@Get('/reservations/:id')
async getReservationById(@Param('id') id: string) {
  return this.hotelService.getReservationById(id);  
}

  //??
  @Get('/reservations')
  async getAllReservations() {
    return this.hotelService.getAllReservations();  
  }
//??
  @Delete('/reservations/:id')
  async deleteReservation(@Param('id') id: string) {
    return this.hotelService.deleteReservation(id);  
  }
}