import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  createUser(@Body() user: { email: string; name: string; uid: string }) {
    return this.userService.createuser(user);
  }

  @Get('/')
  async getUser(@Query('uid') uid: string) {
    if (!uid) {
      throw new BadRequestException('UID gerekli');
    }
    return this.userService.getUser(uid);
  }

  @Post('create-appointment')
  createAppointment(
    @Body()
    appointment: {
      doctorUid: string;
      userUid: string;
      date: Date;
      time: string;
    },
  ) {
    console.log(appointment);
    return this.userService.createAppointment(appointment);
  }

  @Get('appointments')
  getAllAppointments() {
    return this.userService.getAllAppointments();
  }

  @Get('allUsers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
