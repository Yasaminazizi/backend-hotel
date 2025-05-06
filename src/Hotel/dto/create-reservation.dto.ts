import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;  // شناسه هتل

  @IsString()
  @IsNotEmpty()
  roomId: string;  // شناسه اتاق

  @IsString()
  @IsNotEmpty()
  userId: string;  // شناسه کاربر

  @IsDate()
  @IsNotEmpty()
  checkInDate: Date;  // تاریخ ورود

  @IsDate()
  @IsNotEmpty()
  checkOutDate: Date;  // تاریخ خروج

  @IsDate()
  @IsOptional()
  expirationDate?: Date;  // تاریخ انقضا (اختیاری)
}