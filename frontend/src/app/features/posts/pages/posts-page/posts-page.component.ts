import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SubjectsStore } from '@store/subjects/subjects.store';
import { PostService } from '@services/api/post/post.service';

@Component({
  selector: 'app-posts-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './posts-page.component.html',
  host: {
    class: 'contents',
  },
})
export class PostsPageComponent implements OnInit {
  private readonly subjectsStore = inject(SubjectsStore);
  private readonly postService = inject(PostService);

  public readonly subjects = this.subjectsStore.subjects;

  createPostForm = new FormGroup({
    subjectTitle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  isInvalid(controlName: string) {
    const control = this.createPostForm.get(controlName);
    return control?.invalid && control.touched;
  }

  onSubmit() {
    if (this.createPostForm.valid) {
      const postRequest = {
        subjectTitle: this.createPostForm.getRawValue().subjectTitle,
        title: this.createPostForm.getRawValue().title,
        content: this.createPostForm.getRawValue().content,
      };
      this.postService.createPost(postRequest).subscribe();
      this.createPostForm.reset();
    }
  }

  ngOnInit(): void {
    this.subjectsStore.fetchAllSubjects();
  }
}
