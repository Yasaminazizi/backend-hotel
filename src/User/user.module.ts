import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './model/repository/user.repository';  
import { User } from './model/entity/user.entity'; 
import { AuthGuard } from './guard/guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './controller/admin.controller';  
import { HotelModule } from '../Hotel/hotel.module';
import { forwardRef } from '@nestjs/common';
import { InitService } from './service/init.service'; 

//for push on git
@Module({
  imports: [
    forwardRef(() => HotelModule,),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ User]),  
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [UserController,AdminController],
  providers: [UserService,UserRepository,AuthGuard,InitService],  
  exports:[UserService,UserRepository],
})
export class UserModule {}