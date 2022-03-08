import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, page: number) {
    let queryP = `?pageSize=${pageSize}&page=${page}`;
    this.http
      .get<any>('http://localhost:3000/api/posts' + queryP)
      .pipe(
        map((posts) => {
          return {
            posts: posts.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            postsCount: posts.postsCount,
          };
        })
      )
      .subscribe((posts) => {
        this.posts = posts.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postsCount: posts.postsCount,
        });
      });
  }

  getUpdatedPost() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(postId: string, title: string, content: string, image: any) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe((res: Post) => {
        this.router.navigate(['/']);
        // const upadtedPost = [...this.posts];
        // const oldIndex = upadtedPost.findIndex((p) => p.id === postId);
        // const post: Post = {
        //   id: postId,
        //   title: title,
        //   content: content,
        //   imagePath: res.imagePath,
        // };
        // upadtedPost[oldIndex] = post;
        // this.postUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string, image: File) {
    let postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.http
      .post<Post>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        // const post: Post = {
        //   id: res.id,
        //   title: title,
        //   content: content,
        //   imagePath: res.imagePath,
        // };
        this.router.navigate(['/']);
        // this.posts.push(post);
        // this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
