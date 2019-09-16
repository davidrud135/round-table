import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;
  userDisplayName: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService
      .getAuthUser()
      .subscribe((authUser: firebase.User | null) => {
        this.isAuthenticated = !!authUser;
        if (this.isAuthenticated) {
          this.authService.getCurrentUserData().subscribe((user: User) => {
            this.userDisplayName = user.displayName;
          });
        }
      });
  }

  onSignOut() {
    this.authService.signOut();
  }
}
