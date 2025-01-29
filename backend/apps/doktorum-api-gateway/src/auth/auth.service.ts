import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  signIn(auth: AuthDto) {
    return this.authClient.send('auth.signin', auth);
  }

  signUp(createAuthDto: CreateAuthDto) {
    return this.authClient.send('auth.signup', createAuthDto);
  }

  logout(token: string) {
    return this.authClient.send('auth.logout', token);
  }
}
