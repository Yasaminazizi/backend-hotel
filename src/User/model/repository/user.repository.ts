import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity';  // Import User entity
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  
  ) {}

  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);  
    return await this.userRepository.save(user);
  }

  
  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } }) || null;
  }

  
  async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { phoneNumber } }) || null;
  }

  
  async updateUser(id: string, updatedData: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;  
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);  
    }
    this.userRepository.merge(user, updatedData);  
    return await this.userRepository.save(user);
  }

  
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}