import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../model/repository/user.repository';  
import { CreateUserDto } from '../dto/create-user.dto';  
import { UpdateUserDto } from '../dto/update-user.dto';  
import { User } from '../model/entity/user.entity';  
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,  
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);  
      createUserDto.password = hashedPassword;  
      return await this.userRepository.createUser(createUserDto);
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);  
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
      }
      return user;
    } catch (error) {
      throw new HttpException('Error fetching user', HttpStatus.INTERNAL_SERVER_ERROR);  
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.userRepository.updateUser(id, updateUserDto);  
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);  
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
    }

    try {
      await this.userRepository.deleteUser(id);  
    } catch (error) {
      throw new HttpException('Error deleting user', HttpStatus.BAD_REQUEST);  
    }
  }

  async login(phoneNumber: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.getUserByPhoneNumber(phoneNumber);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
      }

      const isMatch = await bcrypt.compare(password, user.password);  
      if (!isMatch) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);  
      }

      return { message: 'Login successful' };  
    } catch (error) {
      throw new HttpException('Error logging in', HttpStatus.INTERNAL_SERVER_ERROR);  
    }
  }
}