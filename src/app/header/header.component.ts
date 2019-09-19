import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './../auth/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.getUser();
  }

  onSignOut() {
    this.authService.signOut();
  }
}
