import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern('user.create')
  createUser(user: { email: string; name: string; uid: string }) {
    console.log(user);
    return this.userService.createUser(user);
  }

  @MessagePattern('user.get')
  getUser(uid: string) {
    return this.userService.getUser(uid);
  }

  @MessagePattern('user.createAppointment')
  createAppointment(appointment: {
    doctorUid: string;
    userUid: string;
    date: Date;
    time: string;
  }) {
    return this.userService.createAppointment(appointment);
  }

  @MessagePattern('user.getAllAppointments')
  getAllAppointments() {
    return this.userService.getAllAppointments();
  }

  @MessagePattern('user.getAllUsers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
