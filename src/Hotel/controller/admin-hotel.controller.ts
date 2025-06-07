import { Controller, Post, Put, Body, Get, Param, Delete, Patch, Request, UseGuards, Query, Req } from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
import { UserService } from '../../User/service/user.service';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { AuthGuard } from '../../User/guard/guard';
import { RolesGuard } from '../../User/guard/roles.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SearchRoomDto } from '../dto/search-room.dto';
import { UserRole } from '../../User/model/enum/role.enum';
import { CreateUserDto } from '../../User/dto/create-user.dto';
import { ReservationStatus } from '../model/enum/status.enum';
import { FilterReservationDto } from '../dto/filter-reservation.dto';

@Controller('admin-hotel')
export class AdminHotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly userService: UserService,
  ) { }

  //1-GET ALL RESERVATION BY ADMIN
  //    @UseGuards(AuthGuard)
  //    @Get('/reservations/user')
  //    async getAllUserReservations(
  //    @Request() req,
  //    @Query('status') status?: ReservationStatus,
  //   ) {
  //   const userId = req.user?.sub;
  //   return this.hotelService.getAllUserReservations(userId, status);
  //  }
  //2-GET RESERVATONS WITH FILTER BY ADMIN
  @Get('/reservations/admin/filter')
  // @UseGuards(AuthGuard)
  async filterReservations(@Query() filterDto: FilterReservationDto) {
    return this.hotelService.filterReservationsByAdmin(filterDto);
  }
  //3-ADMIN CAN CANCEL RESERVATION
  @UseGuards(AuthGuard)
  @Patch('/reservations/:id/cancel')
  async cancelReservation(@Param('id') id: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return this.hotelService.cancelReservation(id);
  }

  //4-ADMIN CAN CHECKOUT RESERVATION
  @UseGuards(AuthGuard)
  @Patch('/reservations/:id/checkout')
  async checkoutReservation(@Param('id') id: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return this.hotelService.checkoutReservation(id);
  }

  // @UseGuards(AuthGuard)
  @Post('/')
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.createHotel(createHotelDto);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelService.updateHotel(id, updateHotelDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteHotel(@Param('id') id: string) {
    return this.hotelService.deleteHotel(id);
  }

  // ---------------------FOR ROOM-------------------
  // @UseGuards(AuthGuard)
  @Post('/rooms')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.hotelService.createRoom(createRoomDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/rooms/:id')
  async deleteRoom(@Param('id') id: string) {
    return this.hotelService.deleteRoom(id);
  }


  @UseGuards(AuthGuard)
  @Get('/rooms/reservations/:id')
  async getReservationById(@Param('id') id: string, @Request() req) {
    const userIdFromToken = req.user?.sub;
    if (!userIdFromToken) {
      throw new HttpException('Unauthorized: userId missing from token', HttpStatus.UNAUTHORIZED);
    }
    return this.hotelService.getReservationById(id, userIdFromToken);
  }

}