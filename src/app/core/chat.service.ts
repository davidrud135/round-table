import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import { User } from './models/user.model';
import { Message } from './models/message.model';
import { AuthService } from './../auth/auth.service';

interface FirestoreMessage {
  senderId: string;
  text: string;
  sentAt: firebase.firestore.Timestamp;
}

interface FirestoreGroupChat {
  messages: FirestoreMessage[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private groupChatDocRef: AngularFirestoreDocument;
  public currUserId: string;

  constructor(
    private afStore: AngularFirestore,
    private authService: AuthService,
  ) {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.currUserId = user.id;
      }
    });
    this.groupChatDocRef = this.afStore.doc('chats/group-chat');
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

  public sendMessage(msgText: string): Promise<void> {
    const messageData = {
      text: msgText,
      senderId: this.currUserId,
      sentAt: new Date(),
    };

    return this.groupChatDocRef.update({
      messages: firestore.FieldValue.arrayUnion(messageData),
    });
  }

  public getMessages(): Observable<Message[]> {
    let groupChat: FirestoreGroupChat;
    const usersDataMap = {};

    return this.groupChatDocRef.valueChanges().pipe(
      switchMap((chat: FirestoreGroupChat) => {
        groupChat = chat;
        return this.getMessagesSendersData(chat.messages);
      }),
      map((usersData: User[]) => {
        usersData.forEach((userData: User) => {
          usersDataMap[userData.id] = userData;
        });
        return groupChat.messages
          .map((message: FirestoreMessage) => {
            const { senderId, ...neededData } = message;
            const transformedMessageData: Message = {
              ...neededData,
              sender: usersDataMap[senderId],
            };
            return transformedMessageData;
          })
          .sort(this.sortMessagesAscendingByTimestamp);
      }),
    );
  }

  private sortMessagesAscendingByTimestamp(
    msg1: Message,
    msg2: Message,
  ): number {
    return msg1.sentAt.toMillis() - msg2.sentAt.toMillis();
  }

  private getMessagesSendersData(
    messages: FirestoreMessage[],
  ): Observable<User[]> {
    const usersUniqueIds: string[] = Array.from(
      new Set(
        messages.map((message: FirestoreMessage) => {
          return message.senderId;
        }),
      ),
    );
    const usersDocsData$: Observable<User>[] = usersUniqueIds.map(
      (id: string) => {
        return this.afStore.doc<User>(`users/${id}`).valueChanges();
      },
    );

    return usersDocsData$.length ? combineLatest(usersDocsData$) : of([]);
  }
}
