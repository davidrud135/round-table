import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.onSuccessSignIn();
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required),
    });
  }

  onSignIn(): void {
    this.isLoading = true;
    const { email, pass } = this.signInForm.value;
    this.authService.signIn(email, pass).catch((errMessage: string) => {
      this._snackBar.open(errMessage, 'OK', {
        verticalPosition: 'top',
      });
      this.isLoading = false;
    });
  }

  onSuccessSignIn(): void {
    this.authService.getAuthUser().subscribe((user: firebase.User | null) => {
      if (user) {
        this.isLoading = false;
        this.router.navigateByUrl('');
      }
    });
  }
}
