import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsOptional() 
  userId?: string; //get token

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
