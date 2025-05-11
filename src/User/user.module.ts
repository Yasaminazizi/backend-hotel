import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './model/repository/user.repository';  
import { User } from './model/entity/user.entity'; 
import { AuthGuard } from './guard/guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

//for push on git
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ User]),  
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository,AuthGuard],  
  exports:[UserService,UserRepository],
})
export class UserModule {}