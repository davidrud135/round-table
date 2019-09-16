import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatroomComponent } from './chatroom/chatroom.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChatroomComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
