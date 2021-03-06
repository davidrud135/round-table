import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/core/models/user.model';
import { ChatService } from './../../core/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.users$ = this.chatService.getAllUsersDataExceptOwner();
  }
}
