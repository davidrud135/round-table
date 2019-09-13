import { Injectable } from '@angular/core';

import { User } from './models/user.model';
import { Message } from './models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private users: User[] = [];
  private messages: Message[] = [];

  constructor() {
    this.users = [
      {
        uid: '0',
        email: 'david.rud135@gmail.com',
        displayName: 'davidrud135',
        photoURL:
          'https://icon-library.net/images/avatar-icon-images/avatar-icon-images-4.jpg',
      },
      {
        uid: '1',
        email: 'vlad246@gmail.com',
        displayName: 'vlad246',
        photoURL:
          'https://www.shareicon.net/download/2015/09/20/104337_avatar.svg',
      },
    ];
    this.messages = [
      { text: 'Hello', sender: this.users[0], sentDate: new Date() },
      { text: 'Anybody?!', sender: this.users[0], sentDate: new Date() },
      { text: 'Anybody?!', sender: this.users[0], sentDate: new Date() },
      { text: 'Anybody?!', sender: this.users[0], sentDate: new Date() },
      { text: 'Anybody?!', sender: this.users[0], sentDate: new Date() },
      {
        text: `Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Voluptates, omnis similique distinctio illo dolorum quas impedit
        quam rerum velit nemo optio error animi,
        nihil voluptate aperiam quae minus ut architecto.`,
        sender: this.users[1],
        sentDate: new Date(),
      },
    ];
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getMessages(): Message[] {
    return this.messages;
  }
}
