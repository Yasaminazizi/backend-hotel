import { Controller, Post, Body, Get, Param, Delete, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '../guard/guard';
import { RolesGuard } from '../../User/guard/roles.guard'; 
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
 //check
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    console.log('کاربر جدید:', createUserDto);
    return this.userService.signup(createUserDto);
  }
  //check
  @Post('/login')
  async login(@Body() loginDto: { phoneNumber: string, password: string }) {
    return this.userService.login(loginDto.phoneNumber, loginDto.password);
  }
  //check
  
  @UseGuards(AuthGuard) 
 @Get('/:id')
  async getUserById(@Param('id') id: string, @Request() req) {
  
  const userIdFromToken = req.user.sub;

  if (userIdFromToken !== id) {
    throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
  }

  return this.userService.getUserById(id);
}

  //check
  @UseGuards(AuthGuard)
  @Get('/')
 async getAllUsers() {
  return this.userService.getAllUsers();  
}


@UseGuards(AuthGuard)
@Patch('/:id')
async updateUser( @Param('id') id: string,@Body() updateUserDto: UpdateUserDto,@Request() req: any
) {
  const userIdFromToken = req.user.sub;

  if (userIdFromToken !== id) {
    throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
  }

  return this.userService.updateUser(id, updateUserDto);
}

@UseGuards(AuthGuard)
@Delete('/:id')
async deleteUser(
  @Param('id') id: string,
  @Request() req: any
) {
  const userIdFromToken = req.user.sub;

  if (userIdFromToken !== id) {
    throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
  }

  return this.userService.deleteUser(id);
}

}