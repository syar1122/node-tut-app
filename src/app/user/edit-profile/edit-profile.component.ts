import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  public form: FormGroup;
  public isLoading: boolean = false;
  constructor(
    private userService: UsersService,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      fName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      lName: new FormControl(null, { validators: [Validators.required] }),
      userName: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      bio: new FormControl(null, { validators: [Validators.required] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      profileImg: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  ngOnInit(): void {}

  editUser() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        console.log(userId, this.form.value);
        this.userService.updateUser(userId, this.form.value);
      }
    });
  }
}
