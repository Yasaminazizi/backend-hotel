import { Entity,PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';  

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @ManyToMany(() => User, (user) => user.roles)
  // users: User[];
}