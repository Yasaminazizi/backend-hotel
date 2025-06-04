import { Controller, Get, UseGuards, Request, HttpException, HttpStatus, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { HotelService } from 'src/Hotel/service/hotel.service';
import { AuthGuard } from '../../User/guard/guard';
import { UserRole } from '../model/enum/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { RolesGuard } from '../../User/guard/roles.guard';


@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly hotelService: HotelService,

  ) { }

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  async createAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    return this.userService.createAdmin(createUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('/users-list')
  async getUsersAndAdmins(@Request() req) {
    if (req.user.role !== UserRole.SUPER_ADMIN) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    return this.userService.getAllUsersAndAdmins();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: string, @Request() req) {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

}






