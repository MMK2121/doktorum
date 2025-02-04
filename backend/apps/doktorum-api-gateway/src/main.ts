import { NestFactory } from '@nestjs/core';
import { DoktorumApiGatewayModule } from './doktorum-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(DoktorumApiGatewayModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  await app.listen(process.env.port ?? 8080);
}
bootstrap();
