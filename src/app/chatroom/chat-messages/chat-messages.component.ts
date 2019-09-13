import { Component, OnInit } from '@angular/core';

import { Message } from '../../core/models/message.model';
import { ChatService } from './../../core/chat.service';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit {
  messages: Message[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messages = this.chatService.getMessages();
  }

  getMessageAvatarStyles(message: Message): object {
    return {
      'background-image': `url(${message.sender.photoURL})`,
      'background-size': 'cover',
    };
  }

  isOwnMessage(message: Message): boolean {
    return message.sender.uid === '0';
  }
}
