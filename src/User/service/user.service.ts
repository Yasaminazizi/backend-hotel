import { Injectable } from '@nestjs/common';
import { UserRepository } from '../model/repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../model/entity/user.entity'; 
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';  
import { UserRole } from '../model/enum/role.enum';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,  
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
   
  ) {
  }

  generateToken(user: any): string {
    const payload = { 
      phoneNumber: user.phoneNumber, 
      sub: user.id,
      role: user.role 
      
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),  
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME') 
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      
      
      if (!token) {
        throw new HttpException('Token is missing or malformed', HttpStatus.UNAUTHORIZED);
      }

      
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      return decoded;  //if verify
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }

  //create super admin
  async createDefaultAdmin(): Promise<void> {
    const defaultPhone = '09389428017';
    const defaultUsername = 'superadmin';
  
    const existing = await this.userRepository.getUserByPhoneNumber(defaultPhone);
    console.log('Looking for user with phone 09389428016...');
    console.log('Found user:', existing);
    if (existing) {
      console.log('Super admin already exists');
      return;
    }
  
    await this.createUser({
      username: defaultUsername,
      phoneNumber: defaultPhone,
      password: 'Super123!',
      role: UserRole.SUPER_ADMIN,
    });
    console.log('Found user:', existing);
    console.log('Default super admin created successfully');
  }

  //create admin by admin
  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.role = UserRole.SUPER_ADMIN;
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.createUser(createUserDto);
  }
  

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      if (!createUserDto.role) {
        createUserDto.role = UserRole.USER;  
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
      return await this.userRepository.createUser(createUserDto);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }

  // async signup(createUserDto: CreateUserDto): Promise<any> {
  //   const existingUser = await this.userRepository.getUserByPhoneNumber(createUserDto.phoneNumber); 
  //   if (existingUser) {
  //     throw new HttpException('User with this phone number already exists', HttpStatus.BAD_REQUEST);  
  //   }

  //   const user = await this.createUser(createUserDto);  
  //   const token = this.generateToken(user);  

  //   return {
  //     message: 'User registered successfully',
  //     user,
  //     token,  
  //   };
  // }
  async signup(createUserDto: CreateUserDto): Promise<any> {
    
    const existingUser = await this.userRepository.getUserByPhoneNumber(createUserDto.phoneNumber); 
    if (existingUser) {
      throw new HttpException('User with this phone number already exists', HttpStatus.BAD_REQUEST);  
    }
  
    
    const existingUsername = await this.userRepository.getUserByUsername(createUserDto.username);
    if (existingUsername) {
      throw new HttpException('Username is already taken', HttpStatus.BAD_REQUEST);
    }
  
    const user = await this.createUser(createUserDto);  
    const token = this.generateToken(user);  
  
    return {
      message: 'User registered successfully',
      user,
      token,  
    };
  }
  

  async login(phoneNumber: string, password: string): Promise<any> {
    const user = await this.userRepository.getUserByPhoneNumber(phoneNumber);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
    }
    const hashPassword = await bcrypt.hash(password, 10);
    try {
      const isMatch = await bcrypt.compare(user.password, hashPassword)  ;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    
    const token = this.generateToken(user);
    
    return {
      message: 'Login successful',
      token,  
    };
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
    console.log('Update request received with data:', updateUserDto); 

    const user = await this.userRepository.getUserById(id);
    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);  
    }

    if (updateUserDto.password) {
        console.log('Password provided:', updateUserDto.password); 
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

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.getAllUsers(); 
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new HttpException('Error fetching all users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //get all person by super admin
  async getAllUsersAndAdmins(): Promise<User[]> {
    return this.userRepository.findUsersAndAdmins();
  }
  
  // async login(phoneNumber: string, password: string): Promise<any> {
  //   try {
  //     console.log('Login attempt for phone number:', phoneNumber);
      
      
  //     const user = await this.userRepository.getUserByPhoneNumber(phoneNumber);
  //     if (!user) {
  //       console.log('User not found');
  //       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }
  
      
  //     console.log('User found:', user);
  
      
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) {
  //       console.log('Password mismatch for user:', phoneNumber);
  //       throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  //     }
  
  //     console.log('Password matched for user:', phoneNumber);
  
  //     return {
  //       message: 'Login successful',
  //       user,
  //     };
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     throw new HttpException('Error loggin in', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}