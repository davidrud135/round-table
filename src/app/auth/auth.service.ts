import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { User } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router,
  ) {
    this.user$ = this.afAuth.user.pipe(
      switchMap((user: firebase.User | null) => {
        if (!user) {
          return of(null);
        }
        return this.afStore
          .collection('users')
          .doc(user.uid)
          .valueChanges();
      }),
    );
  }

  public getUser(): Observable<User | null> {
    return this.user$;
  }

  public isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user: User | null) => !!user));
  }

  public signUp(
    displayName: string,
    email: string,
    pass: string,
  ): Promise<firebase.auth.UserCredential | string> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, pass)
      .then(async (resp: firebase.auth.UserCredential) => {
        const { uid: userId, email: userEmail } = resp.user;
        await this.setNewUserData(userId, displayName, userEmail);
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

  private async setNewUserData(
    id: string,
    displayName: string,
    email: string,
  ): Promise<void> {
    const userDocRef: AngularFirestoreDocument<User> = this.afStore
      .collection('users')
      .doc(id);
    const defaultUserAvatarImageURL = await this.afStorage.storage
      .ref('users-avatar-images/default-avatar.png')
      .getDownloadURL();
    const userData: User = {
      id,
      displayName,
      email,
      photoURL: defaultUserAvatarImageURL,
    };

    return userDocRef.set(userData);
  }
}
