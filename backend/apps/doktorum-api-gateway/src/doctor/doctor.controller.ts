import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('create')
  create(@Body() createDoctorDto: CreateDoctorDto) {
    if (createDoctorDto.password !== createDoctorDto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
    return this.doctorService.create(createDoctorDto);
  }

  @Get('/')
  async findOne(@Query('uid') uid: string) {
    if (!uid) {
      throw new BadRequestException('UID gerekli');
    }
    return this.doctorService.findOne(uid);
  }

  @Get('/all')
  findAll() {
    return this.doctorService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
