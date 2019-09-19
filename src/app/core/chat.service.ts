import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './models/user.model';
import { AuthService } from './../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private currUserId: string;

  constructor(
    private afStore: AngularFirestore,
    private authService: AuthService,
  ) {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.currUserId = user.id;
      }
    });
  }

  public getAllUsersDataExceptOwner(): Observable<User[]> {
    return this.afStore
      .collection<User>('users')
      .valueChanges()
      .pipe(
        map((users: User[]) => {
          return users.filter((user: User) => user.id !== this.currUserId);
        }),
      );
  }
}
