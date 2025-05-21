import { Controller, Post,Put, Body, Get, Param, Delete, Patch, Request, UseGuards,Query ,Req} from '@nestjs/common';
import { HotelService } from '../service/hotel.service';
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
import {FilterReservationDto} from '../dto/filter-reservation.dto'


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

@UseGuards(AuthGuard)
@Post('/reservations/')
async createReservation(
  @Body() createReservationDto: CreateReservationDto,
  @Request() req,
) {
  console.log('User from token:', req.user); 
  const userIdFromToken = req.user?.sub;
  if (!userIdFromToken) {
    throw new HttpException('Unauthorized: userId missing from token', HttpStatus.UNAUTHORIZED);
  }
  return this.hotelService.createReservation({ ...createReservationDto, userId: userIdFromToken });
}
//for admin
@UseGuards(AuthGuard,RolesGuard)
@Get('/reservations/user')
async getAllUserReservations(
  @Request() req,
  @Query('status') status?: ReservationStatus,
) {
  const userId = req.user?.sub;
  return this.hotelService.getAllUserReservations(userId, status);
}





//////////////////
  //??
  @Get('/reservations')
  async getAllReservations() {
    return this.hotelService.getAllReservations();  
  }

  
  @Get('/reservations/admin/filter')
  @UseGuards(AuthGuard,RolesGuard)
  async filterReservations(@Query() filterDto: FilterReservationDto) {
    return this.hotelService.filterReservationsByAdmin(filterDto);
  }

  
  
//??
  @Delete('/reservations/:id')
  async deleteReservation(@Param('id') id: string) {
    return this.hotelService.deleteReservation(id);  
  }

  @UseGuards(AuthGuard)
@Get('/reservations/:id')
async getReservationById(@Param('id') id: string, @Request() req) {
  const userIdFromToken = req.user?.sub;
  if (!userIdFromToken) {
    throw new HttpException('Unauthorized: userId missing from token', HttpStatus.UNAUTHORIZED);
  }
  return this.hotelService.getReservationById(id, userIdFromToken);
}

  @Post('/rooms/search')
    async searchRoom(@Body() searchDto: SearchRoomDto) {
   return this.hotelService.searchRoomAvailability(searchDto);
 }
 @UseGuards(AuthGuard,RolesGuard)
     @Patch('/reservations/:id/cancel')
     async cancelReservation(@Param('id') id: string, @Request() req) {
     if (req.user.role !== UserRole.ADMIN) {
       throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
     }
     return this.hotelService.cancelReservation(id);
    }

     @UseGuards(AuthGuard,RolesGuard)
     @Patch('/reservations/:id/checkout')
     async checkoutReservation(@Param('id') id: string, @Request() req) {
     if (req.user.role !== UserRole.ADMIN) {
       throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }
      return this.hotelService.checkoutReservation(id);
     }


     
}