import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  mode = 'Post';
  private postId: string = '';
  public post: Post = {
    id: null,
    title: null,
    content: null,
    imagePath: null,
    creator: null,
  };
  public form: FormGroup = new FormGroup({});
  isLoading = false;
  imgSrc;

  constructor(public postServise: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.mode = 'Edit';
        this.postId = param.get('postId')!;
        this.isLoading = true;
        this.postServise.getPost(this.postId).subscribe((post) => {
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: null,
          };
          console.log(post);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post?.imagePath,
          });

          this.isLoading = false;
        });
      } else {
        this.mode = 'Post';
        this.postId = '';
      }
    });
  }

  savePost() {
    this.isLoading = true;

    this.postServise.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    );

    this.form.reset();
  }

  editPost() {
    this.isLoading = true;
    console.log(this.form.value.image);
    this.postServise.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    );
    this.form.reset();
  }

  onImgPick(event: Event) {
    let file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgSrc = reader.result;
    };
  }
}
