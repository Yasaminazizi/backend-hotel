import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../model/enum/role.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);