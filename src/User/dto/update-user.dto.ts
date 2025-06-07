import { IsString, IsPhoneNumber, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;  

  @IsString()
  @MinLength(11)
  @IsOptional()
 

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;  
}