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
  private currentUserId: string;

  constructor(
    private afStore: AngularFirestore,
    private authService: AuthService,
  ) {
    this.authService.getAuthUser().subscribe((user: firebase.User | null) => {
      if (user) {
        this.currentUserId = user.uid;
      }
    });
  }

  public getAllUsersDataExceptOwner(): Observable<User[]> {
    return this.afStore
      .collection<User>('users')
      .snapshotChanges()
      .pipe(
        map(this.getDocsDataWithId),
        map((users: User[]) => {
          return users.filter((user: User) => user.id !== this.currentUserId);
        }),
      );
  }

  private getDocsDataWithId(
    collectionActions: DocumentChangeAction<any>[],
  ): any[] {
    return collectionActions.map((docAction: DocumentChangeAction<any>) => {
      const doc = docAction.payload.doc;
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });
  }
}
