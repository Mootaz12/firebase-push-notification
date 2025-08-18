import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { FirebaseConfigType } from 'src/config/firebase.config';
export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    const firebaseConfig =
      configService.getOrThrow<FirebaseConfigType>('firebaseConfig');
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        clientEmail: firebaseConfig.clientEmail,
        privateKey: firebaseConfig.privatekey?.replace(/\\n/g, '\n'),
      }),
    });
    return { defaultApp };
  },
  inject: [ConfigService],
};
