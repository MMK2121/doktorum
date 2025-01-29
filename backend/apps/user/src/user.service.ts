import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
  private readonly client: ClientProxy;

  async createUser({ email, name, uid }) {
    await admin.firestore().collection('users').doc(uid).set({
      email,
      name,
    });
    return {
      message: 'Kullanıcı başarıyla oluşturuldu.',
    };
  }

  async getUser(uid: string) {
    if (!uid || typeof uid !== 'string') {
      throw new BadRequestException('Invalid UID provided');
    }

    try {
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        throw new NotFoundException('User not found');
      }

      return {
        ...userDoc.data(),
        uid: userDoc.id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching user data');
    }
  }

  async createAppointment(appointment: {
    doctorUid: string;
    userUid: string;
    date: Date;
    time: string;
  }) {
    const { doctorUid, userUid, date, time } = appointment;

    if (!doctorUid || !userUid || !date) {
      throw new BadRequestException('Invalid appointment data');
    }

    try {
      const doctorDoc = await admin
        .firestore()
        .collection('doctors')
        .doc(doctorUid)
        .get();

      if (!doctorDoc.exists) {
        throw new NotFoundException('Doctor not found');
      }

      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(userUid)
        .get();

      if (!userDoc.exists) {
        throw new NotFoundException('User not found');
      }

      await admin.firestore().collection('appointments').add({
        doctorUid,
        userUid,
        date,
        time,
      });

      return {
        message: 'Appointment created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error creating appointment');
    }
  }

  async getAllAppointments() {
    try {
      const appointments = await admin
        .firestore()
        .collection('appointments')
        .get();

      return appointments.docs.map((appointment) => appointment.data());
    } catch (error) {
      throw new BadRequestException('Error fetching appointments');
    }
  }

  async getAllUsers() {
    try {
      const users = await admin.firestore().collection('users').get();
      return users.docs.map((user) => {
        return {
          ...user.data(),
          uid: user.id,
        };
      });
    } catch (error) {
      throw new BadRequestException('Error fetching users');
    }
  }
}
