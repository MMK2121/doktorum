import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Email ve şifre zorunludur.');
    }

    return this.authService.signIn(dto);
  }

  @Post('signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    if (!createAuthDto.email || !createAuthDto.password) {
      throw new UnauthorizedException('Email ve şifre zorunludur.');
    }

    return this.authService.signUp(createAuthDto);
  }

  @Post('logout')
  logout(@Body() token: string) {
    return this.authService.logout(token);
  }
}
