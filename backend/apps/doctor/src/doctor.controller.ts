import { Controller, Get } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @MessagePattern('doctor.create')
  createDoctor(Doctor: Doctor) {
    return this.doctorService.createDoctor(Doctor);
  }

  @MessagePattern('doctor.findOne')
  getSelectedOneDoctor(uid: string) {
    return this.doctorService.getSelectedOneDoctor(uid);
  }

  @MessagePattern('doctor.findAll')
  getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

}
