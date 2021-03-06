import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { ProfileAvatarActionsResponse } from '../../models/profile-avatar-actions-response.model';

@Component({
  selector: 'app-profile-avatar-actions',
  templateUrl: './profile-avatar-actions.component.html',
  styleUrls: ['./profile-avatar-actions.component.scss'],
})
export class ProfileAvatarActionsComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInputElem: ElementRef;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ProfileAvatarActionsComponent>,
  ) {}

  ngOnInit() {}

  openFileDialog(): void {
    this.fileInputElem.nativeElement.click();
  }

  onFileSelected(event): void {
    const file: File = event.target.files[0];
    const isImageFile = file.type.includes('image');
    let response: ProfileAvatarActionsResponse;
    if (isImageFile) {
      response = { type: 'upload', image: file };
    } else {
      response = { type: 'not-image' };
    }
    this._bottomSheetRef.dismiss(response);
  }

  onImageDelete(): void {
    const response: ProfileAvatarActionsResponse = {
      type: 'remove',
    };
    this._bottomSheetRef.dismiss(response);
  }

  onCancel(): void {
    this._bottomSheetRef.dismiss();
  }
}
