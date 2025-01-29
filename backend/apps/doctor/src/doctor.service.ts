import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class DoctorService {
  async createDoctor(doctor: Doctor) {
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: doctor.email,
        password: doctor.password,
      });

      // Create custom token
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      // Create doctor document in Firestore
      await admin
        .firestore()
        .collection('doctors')
        .doc(userRecord.uid)
        .set({
          ...doctor,
          uid: userRecord.uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // Return the response
      return {
        uid: userRecord.uid,
        token: customToken,
        email: userRecord.email,
      };
    } catch (error) {
      throw new Error(`Doktor oluşturulamadı: ${error.message}`);
    }
  }

  async getSelectedOneDoctor(uid: string) {
    try {
      // Get doctor document from Firestore
      const doctor = await admin
        .firestore()
        .collection('doctors')
        .doc(uid)
        .get();

      // Return the response
      return doctor.data();
    } catch (error) {
      throw new Error(`Doktor getirilemedi: ${error.message}`);
    }
  }

  async getAllDoctors() {
    try {
      const doctors = await admin.firestore().collection('doctors').get();

      return doctors.docs.map((doctor) => doctor.data());
    } catch (error) {
      throw new Error(`Doktorlar getirilemedi: ${error.message}`);
    }
  }

}
