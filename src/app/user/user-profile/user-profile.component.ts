import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  public user: any;
  public isLoaded = true;
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute
  ) {
    this.isLoaded = false;
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {}
}
