import { Inject, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DoctorService {
  constructor(@Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy) {}
  create(createDoctorDto: CreateDoctorDto) {
    return this.doctorClient.send('doctor.create', createDoctorDto);
  }

  findOne(uid: string) {
    return this.doctorClient.send('doctor.findOne', uid);
  }

  findAll() {
    return this.doctorClient.send('doctor.findAll', {});
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
