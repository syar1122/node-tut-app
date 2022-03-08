import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get('http://localhost:3000/api/user/profile');
  }

  updateUser(userId: string, { lName, fName, userName, email, bio, gender }) {
    let userData: FormData | User;
    // if (typeof image === 'object') {
    userData = new FormData();
    userData.append('lName', lName);
    userData.append('fName', fName);
    userData.append('userName', userName);
    userData.append('email', email);
    userData.append('bio', bio);
    userData.append('gender', gender);

    console.log(userData.get('gender'));

    // } else {
    //   userData = {
    //     id: postId,
    //     title: title,
    //     content: content,
    //     imagePath: image,
    //     creator: null,
    //   };
  }
}
