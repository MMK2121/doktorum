import { NestFactory } from '@nestjs/core';
import { DoctorModule } from './doctor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DoctorModule,
    {
      transport: Transport.TCP,
      options: {
        port: 8083,
      },
    },
  );
  const configService = app.get(ConfigService);
  const databaseURL = configService.get<string>('FIREBASE_DATABASE_URL');

  const adminConfig = {
    credential: admin.credential.cert(require('doktorum-firebase-config.json')),
    databaseURL,
  };
  admin.initializeApp(adminConfig);
  await app.listen();
}
bootstrap();
