import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Message } from '../../core/models/message.model';
import { ChatService } from './../../core/chat.service';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, AfterViewInit {
  @ViewChild('chatBox', { static: false }) chatBoxElemRef: ElementRef;
  messages$: Observable<Message[]>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ = this.chatService
      .getMessages()
      .pipe(tap(() => setTimeout(() => this.scrollChatToBottom(), 500)));
  }

  ngAfterViewInit(): void {
    this.scrollChatToBottom();
  }

  getMessageAvatarStyles(message: Message): object {
    return {
      'background-image': `url(${message.sender.photoURL})`,
      'background-size': 'cover',
    };
  }

  isOwnMessage(message: Message): boolean {
    return message.sender.id === this.chatService.currUserId;
  }

  formatMessageTimestamp(message: Message): string {
    const formattingOptions = {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };
    return message.sentAt
      .toDate()
      .toLocaleDateString('en-US', formattingOptions);
  }

  scrollChatToBottom(): void {
    this.chatBoxElemRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
}
