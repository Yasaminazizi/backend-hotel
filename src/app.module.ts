import * as dotenv from 'dotenv';
dotenv.config();  

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './User/user.module';
import { HotelModule } from './Hotel/hotel.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,  
      port: Number(process.env.DB_PORT) || 5432,  
      username: process.env.DB_USER,  
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME,  
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UserModule,
    HotelModule,
  ],
})
export class AppModule {}