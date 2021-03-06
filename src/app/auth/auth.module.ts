import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './../material.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';

import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AnonymousGuard } from './anonymous.guard';

const routes: Routes = [
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [AnonymousGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
  ],
  declarations: [SignUpComponent, SignInComponent],
})
export class AuthModule {}
