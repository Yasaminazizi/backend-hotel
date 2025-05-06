import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../model/entity/role.entity';  
import { CreateRoleDto } from '../../dto/create-role.dto';  

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,  
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role | null> {
    const role = this.roleRepository.create(createRoleDto);  
    return await this.roleRepository.save(role);  
  }

  async getRoleById(id: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { id } }) || null; 
  }

  async updateRole(id: string, updatedData: CreateRoleDto): Promise<Role | null> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      return null;  
    }

    this.roleRepository.merge(role, updatedData);  
    return await this.roleRepository.save(role);  
  }

  async deleteRole(id: string): Promise<void> {
    await this.roleRepository.softDelete(id); 
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();  
  }
}