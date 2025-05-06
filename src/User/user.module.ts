import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './model/repository/user.repository';  
import { User } from './model/entity/user.entity'; 
//for push on git
@Module({
  imports: [
    TypeOrmModule.forFeature([ User]),  
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository ],  
})
export class UserModule {}