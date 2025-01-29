import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  private readonly client: ClientProxy;

  async signup(email: string, password: string, name: string) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      // await this.client
      //   .send('user.create', {
      //     email: userRecord.email,
      //     uid: userRecord.uid,
      //     name: name,
      //   })
      //   .toPromise();

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        message: 'Kullanıcı başarıyla oluşturuldu.',
      };
    } catch (error) {
      throw new Error(`Kullanıcı oluşturulamadı: ${error.message}`);
    }
  }

  async signin(email: string, password: string) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı.');

      const customToken = await admin.auth().createCustomToken(user.uid);

      return {
        message: 'Giriş başarılı',
        token: customToken,
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      };
    } catch (error) {
      throw new UnauthorizedException(`Giriş başarısız: ${error.message}`);
    }
  }

  async logout(token: string) {
    try {
      await admin.auth().revokeRefreshTokens(token);
      return {
        message: 'Çıkış başarılı',
      };
    } catch (error) {
      throw new Error(`Çıkış başarısız: ${error.message}`);
    }
  }
}
