import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCTOR_SERVICE',
        transport: Transport.TCP,
        options: { port: 8083 },
      },
    ]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
