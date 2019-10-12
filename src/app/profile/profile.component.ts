import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from './../auth/auth.service';
import { ProfileService } from './../core/profile.service';
import { ConfirmDialogComponent } from './../core/components/confirm-dialog/confirm-dialog.component';
import { ProfileAvatarActionsComponent } from './../core/components/profile-avatar-actions/profile-avatar-actions.component';
import { ProfileAvatarActionsResponse } from '../core/models/profile-avatar-actions-response.model';
import { User } from './../core/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm', { static: false }) profileForm: NgForm;
  user: User;
  uploadPercentage$: Observable<number>;
  successSnackBarDuration = 3000;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private _sanitizer: DomSanitizer,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    public _dialog: MatDialog,
  ) {
    this.authService.getUser().subscribe((user: User) => (this.user = user));
  }

  ngOnInit() {}

  resetForm(): void {
    const { displayName, email } = this.user;
    const { displayNameControl, emailControl } = this.profileForm.controls;
    displayNameControl.reset(displayName);
    emailControl.reset(email);
  }

  onSaveForm(): void {
    this._dialog
      .open(ConfirmDialogComponent, {
        data: { headerText: 'Update profile data' },
      })
      .afterClosed()
      .subscribe(this.handleProfileUpdateConfirmResponse);
  }

  getSafeAvatarURLStyle(user: User): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${user.photoURL})`);
  }

  openAvatarActions(): void {
    this._bottomSheet
      .open(ProfileAvatarActionsComponent)
      .afterDismissed()
      .subscribe(this.handleProfileAvatarActionsResponse);
  }

  onAvatarImageUpload(image: File): Observable<number> {
    return this.profileService
      .uploadAvatarImage(image)
      .percentageChanges()
      .pipe(
        finalize(() => {
          this.uploadPercentage$ = null;
          this._snackBar.open('Avatar image uploaded.', '', {
            duration: this.successSnackBarDuration,
          });
        }),
      );
  }

  onAvatarImageRemove(): void {
    this.profileService
      .setDefaultUserAvatarImage()
      .then(() =>
        this._snackBar.open('Avatar removed.', '', {
          duration: this.successSnackBarDuration,
        }),
      )
      .catch(() => {
        this._snackBar.open('Can\'t remove default avatar image!', 'OK');
      });
  }

  // Functions as callbacks to change 'this' behavior

  handleProfileAvatarActionsResponse = (
    resp: ProfileAvatarActionsResponse | undefined,
  ): void => {
    if (!resp) {
      return;
    }
    switch (resp.type) {
      case 'upload':
        this.uploadPercentage$ = this.onAvatarImageUpload(resp.image);
        break;
      case 'remove':
        this.onAvatarImageRemove();
        break;
      case 'not-image':
        this._snackBar.open('Avatar can be only of image type!', 'OK');
    }
  }

  handleProfileUpdateConfirmResponse = (isConfirmed: boolean): void => {
    if (!isConfirmed) {
      return this.resetForm();
    }
    const newDisplayName = this.profileForm.controls['displayNameControl']
      .value;
    this.profileService
      .updateProfileData({ displayName: newDisplayName })
      .then(() => {
        this._snackBar.open('Profile updated.', '', {
          duration: this.successSnackBarDuration,
        });
      });
  }
}
