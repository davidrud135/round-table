import { Component, OnInit } from '@angular/core';

import { ChatService } from './../../core/chat.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnInit {
  msgFieldValue: string;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  onMessageSend(): void {
    const msgText = this.msgFieldValue.trim();
    if (!msgText) {
      return;
    }
    this.chatService.sendMessage(msgText);
    this.msgFieldValue = '';
  }
}
