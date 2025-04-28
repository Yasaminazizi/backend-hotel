import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);  
  }

  @Post('login')
  async login(@Body() loginDto: { phoneNumber: string, password: string }) {
    return this.userService.login(loginDto.phoneNumber, loginDto.password);  
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);  
  }

  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);  
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);  
  }
}