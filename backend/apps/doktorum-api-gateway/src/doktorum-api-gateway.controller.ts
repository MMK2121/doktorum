import { Controller, Get } from '@nestjs/common';
import { DoktorumApiGatewayService } from './doktorum-api-gateway.service';

@Controller()
export class DoktorumApiGatewayController {
  constructor(private readonly doktorumApiGatewayService: DoktorumApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.doktorumApiGatewayService.getHello();
  }
}
