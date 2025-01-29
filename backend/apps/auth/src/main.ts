import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        port: 8081,
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
