import { Component, OnInit } from '@angular/core';
import { AuthInterceptor } from './auth.interceptor';
import { Post } from './models/post.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'NodeTutApp';
  posts: Post[] = [];

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  onPostAdd(post: Post) {
    console.log('app', post);
    this.posts.push(post);
  }
}
