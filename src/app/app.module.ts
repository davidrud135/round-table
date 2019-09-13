import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { UsersListComponent } from './chatroom/users-list/users-list.component';
import { ChatMessagesComponent } from './chatroom/chat-messages/chat-messages.component';
import { ControlPanelComponent } from './chatroom/control-panel/control-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    HeaderComponent,
    UsersListComponent,
    ChatMessagesComponent,
    ControlPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
