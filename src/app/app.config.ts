import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-baf68","appId":"1:848918700394:web:fba847701fe28f32b6c513","storageBucket":"ring-of-fire-baf68.firebasestorage.app","apiKey":"AIzaSyD54h-KHW0T9CeQ3gtwjhX38UtZl9X5AtQ","authDomain":"ring-of-fire-baf68.firebaseapp.com","messagingSenderId":"848918700394"})), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())]
};
