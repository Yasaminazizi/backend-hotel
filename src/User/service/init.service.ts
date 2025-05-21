import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from '../../User/service/user.service';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.userService.createDefaultAdmin();
  }
}