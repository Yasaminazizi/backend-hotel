import { IsString, IsNotEmpty, MinLength, IsPhoneNumber,IsStrongPassword,IsEnum,IsOptional  } from 'class-validator';
import { UserRole } from '../model/enum/role.enum';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsPhoneNumber('IR')  
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  @Exclude()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()  
  role?: UserRole;
}