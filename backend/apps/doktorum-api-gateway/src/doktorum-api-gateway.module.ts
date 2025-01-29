import { Module } from '@nestjs/common';
import { DoktorumApiGatewayController } from './doktorum-api-gateway.controller';
import { DoktorumApiGatewayService } from './doktorum-api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { DoctorModule } from './doctor/doctor.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, ReviewModule, DoctorModule],
  controllers: [DoktorumApiGatewayController],
  providers: [DoktorumApiGatewayService],
})
export class DoktorumApiGatewayModule {}
