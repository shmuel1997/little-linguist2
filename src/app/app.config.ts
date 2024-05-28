import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'little-linguist2',
        appId: '1:978986824361:web:f06e2fb11b0d8a8f8aafb8',
        storageBucket: 'little-linguist2.appspot.com',
        apiKey: 'AIzaSyA7YcNWgiFkUUkYBn5a0S6Ooj_A-MyzsHo',
        authDomain: 'little-linguist2.firebaseapp.com',
        messagingSenderId: '978986824361',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
