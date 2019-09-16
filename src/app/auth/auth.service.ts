import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$: Observable<firebase.User | null>;
  private currentUserId: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router,
  ) {
    this.user$ = this.afAuth.user;
    this.user$.subscribe((user: firebase.User) => {
      if (user) {
        this.currentUserId = user.uid;
      }
    });
  }

  public getAuthUser(): Observable<firebase.User | null> {
    return this.user$;
  }

  public isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user: firebase.User | null) => !!user));
  }

  public signUp(
    displayName: string,
    email: string,
    pass: string,
  ): Promise<firebase.auth.UserCredential | string> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, pass)
      .then((resp: firebase.auth.UserCredential) => {
        const { uid: userId, email: userEmail } = resp.user;
        this.addNewUserToDB(userId, displayName, userEmail);
        return resp;
      })
      .catch(this.handleAuthError);
  }

  public signIn(
    email: string,
    pass: string,
  ): Promise<firebase.auth.UserCredential | string> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, pass)
      .catch(this.handleAuthError);
  }

  public signOut(): Promise<void> {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigateByUrl('/sign-in');
    });
  }

  private handleAuthError(error: firebase.auth.Error): Promise<string> {
    let errorMessage = 'An unknown error occurred!';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'User with given email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Given email is not valid.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Wrong email or password.';
    }
    return Promise.reject(errorMessage);
  }

  public getCurrentUserData(): Observable<User> {
    return this.afStore
      .collection('users')
      .doc<User>(this.currentUserId)
      .valueChanges();
  }

  // tslint:disable: max-line-length
  private addNewUserToDB(
    id: string,
    displayName: string,
    email: string,
  ): Promise<void> {
    const defaultUserAvatarURL =
      'https://firebasestorage.googleapis.com/v0/b/round-table-chat.appspot.com/o/users-avatar-images%2Fdefault-avatar.png?alt=media&token=46277007-c947-4c38-b32a-b726df8ef85e';
    const userData = {
      displayName,
      email,
      photoURL: defaultUserAvatarURL,
    };

    return this.afStore
      .collection('users')
      .doc(id)
      .set(userData);
  }
}
