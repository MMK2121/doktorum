import { Injectable } from '@nestjs/common';

@Injectable()
export class DoktorumApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
