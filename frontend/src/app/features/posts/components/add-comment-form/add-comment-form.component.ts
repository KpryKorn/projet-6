import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { PostService } from '@services/post/post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-comment-form',
  imports: [ReactiveFormsModule, TextareaModule, ButtonModule],
  host: { class: 'contents' },
  templateUrl: './add-comment-form.component.html',
})
export class AddCommentFormComponent {
  private readonly postService = inject(PostService);

  private readonly route = inject(ActivatedRoute);
  readonly postId = Number(this.route.snapshot.paramMap.get('postId'));

  commentForm = new FormGroup({
    content: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    }),
  });

  onSubmit() {
    if (this.commentForm.valid) {
      const request = {
        content: this.commentForm.getRawValue().content,
        postId: this.postId,
      };
      this.postService.createComment(request).subscribe();
      this.commentForm.reset();
    }
  }

  isInvalid(controlName: string) {
    const control = this.commentForm.get(controlName);
    return control?.invalid && control.touched;
  }
}
