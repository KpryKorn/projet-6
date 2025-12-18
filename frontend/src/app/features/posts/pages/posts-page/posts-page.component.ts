import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SubjectsService } from '@services/api/subjects/subjects.service';
import { Subject } from '@models/subject';

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
  private readonly subjectsService = inject(SubjectsService);

  private readonly subjectsState = signal<Subject[] | null>(null);

  public readonly subjects = this.subjectsState.asReadonly();

  createPostForm = new FormGroup({
    subject: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  loadSubjects() {
    this.subjectsService.getAllSubjects().subscribe((subjects) => {
      this.subjectsState.set(subjects);
    });
  }

  isInvalid(controlName: string) {
    const control = this.createPostForm.get(controlName);
    return control?.invalid && control.touched;
  }

  onSubmit() {
    if (this.createPostForm.valid) {
      const formValue = this.createPostForm.value;
      console.log('Form submitted:', formValue);
    }
  }

  ngOnInit(): void {
    this.loadSubjects();
  }
}
