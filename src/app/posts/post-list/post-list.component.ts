import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/post.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPost = 3;
  pageSize = 2;
  currentPage = 0;
  userId: string;
  pageIndex = 0;
  private authStatusListenerSub: Subscription;
  userIsAuthenticated = false;
  constructor(
    public postServise: PostService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.postServise.getPosts(this.pageSize, 1);
    this.postServise.getUpdatedPost().subscribe((post) => {
      this.posts = post.posts;
      this.totalPost = post.postsCount;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusListenerSub = this.authService
      .getAuthStatus()
      .subscribe((result) => {
        this.userIsAuthenticated = result;
        this.userId = this.authService.getUserId();
      });
    console.log(this.userIsAuthenticated);
    console.log(this.userId);
  }

  onDelete(id: string) {
    this.isLoading = true;
    console.log('id delete', id);
    this.postServise.deletePost(id).subscribe(() => {
      console.log(this.pageSize, this.currentPage);
      this.postServise.getPosts(this.pageSize, this.currentPage);
    });
  }

  onEdit(postId: string) {
    this.router.navigateByUrl('edit/' + postId);
  }

  onChangePage(event) {
    console.log(event);
    this.isLoading = true;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postServise.getPosts(this.pageSize, this.currentPage + 1);
  }

  ngOnDestroy(): void {
    //this.authStatusListenerSub.unsubscribe();
  }
}
