import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'reflect-metadata';
import { ChatComponent } from './app/pages/chat/chat.component';
import { MessengerComponent } from './app/pages/chat/messenger/messenger.component';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));