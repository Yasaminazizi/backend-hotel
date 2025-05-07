import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;  

  @IsString()
  @IsNotEmpty()
  roomId: string;  

  @IsString()
  @IsNotEmpty()
  userId: string;  

  @IsDate()
  @IsNotEmpty()
  checkInDate: Date;  

  @IsDate()
  @IsNotEmpty()
  checkOutDate: Date;  
  @IsDate()
  @IsOptional()
  expirationDate?: Date;  
}