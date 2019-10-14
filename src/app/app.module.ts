import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthModule } from './auth/auth.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { UsersListComponent } from './chatroom/users-list/users-list.component';
import { ChatMessagesComponent } from './chatroom/chat-messages/chat-messages.component';
import { ControlPanelComponent } from './chatroom/control-panel/control-panel.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileAvatarActionsComponent } from './core/components/profile-avatar-actions/profile-avatar-actions.component';
import { ConfirmDialogComponent } from './core/components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    HeaderComponent,
    UsersListComponent,
    ChatMessagesComponent,
    ControlPanelComponent,
    ProfileComponent,
    ProfileAvatarActionsComponent,
    ConfirmDialogComponent,
  ],
  entryComponents: [ProfileAvatarActionsComponent, ConfirmDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
