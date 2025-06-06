import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../model/entity/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { IsNull } from 'typeorm';
import { UserRole } from '../../model/enum/role.enum';
import { instanceToPlain } from 'class-transformer';


@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }


  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });

  }

  //for signup
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }



  async getUserByPhoneNumber(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        phoneNumber: phone,
        deletedAt: IsNull(), // فقط کاربرای فعال
      },
    });
  }


  async updateUser(id: string, updatedData: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    // if (updatedData.password) {
    //   updatedData.password = await bcrypt.hash(updatedData.password, 10);
    // }

    this.userRepository.merge(user, updatedData);
    return await this.userRepository.save(user);
  }


  async deleteUser(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }


  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //for all person in site:


  async findUsersAndAdmins(): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { role: UserRole.USER },
        { role: UserRole.ADMIN }
      ],
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        role: true,
        createdAt: true
      },
      order: {
        createdAt: 'DESC'
      }
    });
  }
}