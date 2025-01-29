import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  createuser(user: { email: string; name: string; uid: string }) {
    return this.userClient.send('user.create', user);
  }

  getUser(uid: string) {
    return this.userClient.send('user.get', uid);
  }

  createAppointment(appointment: {
    doctorUid: string;
    userUid: string;
    date: Date;
    time: string;
  }) {
    return this.userClient.send('user.createAppointment', appointment);
  }

  getAllAppointments() {
    return this.userClient.send('user.getAllAppointments', {});
  }

  getAllUsers() {
    return this.userClient.send('user.getAllUsers', {});
  }
}
