import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './../auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  passwordMinLength = 6;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.onSuccessSignIn();
    this.signUpForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
      ]),
    });
  }

  onSignUp(): void {
    this.isLoading = true;
    const { displayName, email, pass } = this.signUpForm.value;
    this.authService
      .signUp(displayName, email, pass)
      .catch((errMessage: string) => {
        this._snackBar.open(errMessage, 'OK', {
          verticalPosition: 'top',
        });
        this.isLoading = false;
      });
    this.signUpForm.reset();
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
