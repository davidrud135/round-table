import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/core/models/user.model';
import { ChatService } from './../../core/chat.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.users = this.chatService.getUsers();
  }
}
