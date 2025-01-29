import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.signup')
  signup(@Payload() createAuthDto: CreateAuthDto) {
    return this.authService.signup(
      createAuthDto.email,
      createAuthDto.password,
      createAuthDto.name,
    );
  }

  @MessagePattern('auth.signin')
  signin(@Payload() auth: AuthDto) {
    return this.authService.signin(auth.email, auth.password);
  }

  @MessagePattern('auth.logout')
  logout(@Payload() token: string) {
    return this.authService.logout(token);
  }
}
