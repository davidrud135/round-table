import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

import { User } from './models/user.model';
import { AuthService } from './../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private userData: User;
  private defaultAvatarImageURL: string;

  constructor(
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore,
    private authService: AuthService,
  ) {
    this.authService
      .getUser()
      .subscribe((user: User) => (this.userData = user));
    this.afStorage
      .ref('users-avatar-images/default-avatar.png')
      .getDownloadURL()
      .subscribe((url: string) => (this.defaultAvatarImageURL = url));
  }

  public uploadAvatarImage(image: File): AngularFireUploadTask {
    this.removeCurrUserAvatarImage();
    const { id: userId } = this.userData;
    const clearImageName = this.getClearImageName(image.name);
    const imagePath = `users-avatar-images/${userId}_${clearImageName}`;
    const imageRef = this.afStorage.storage.ref(imagePath);
    const task = this.afStorage.upload(imagePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const uploadedImageURL = await imageRef.getDownloadURL();
          this.updateProfileData({ photoURL: uploadedImageURL });
        }),
      )
      .subscribe();
    return task;
  }

  public updateProfileData(data: Partial<User>): Promise<void> {
    return this.afStore
      .doc<User>(`users/${this.userData.id}`)
      .update(data)
      .catch(this.handleStorageError);
  }

  public async setDefaultUserAvatarImage(): Promise<any> {
    return Promise.all([
      this.removeCurrUserAvatarImage(),
      this.updateProfileData({ photoURL: this.defaultAvatarImageURL }),
    ]);
  }

  public async removeCurrUserAvatarImage(): Promise<any> {
    const { photoURL: currUserAvatarImageURL } = this.userData;
    if (this.defaultAvatarImageURL === currUserAvatarImageURL) {
      return Promise.reject();
    }
    return this.afStorage.storage
      .refFromURL(currUserAvatarImageURL)
      .delete()
      .catch(this.handleStorageError);
  }

  private getClearImageName(originalImageName: string): string {
    return originalImageName
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/\W/g, '');
  }

  private handleStorageError(err: any): void {
    console.error(err);
  }
}
