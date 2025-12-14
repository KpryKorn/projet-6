import { Component, inject, OnInit, signal } from '@angular/core';
import { TailwindWrapperComponent } from '@components/tailwind-wrapper/tailwind-wrapper.component';
import { Subject } from '@models/subject';
import { SubjectsService } from '@services/api/subjects/subjects.service';
import { Observable, tap } from 'rxjs';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-subjects-page',
  imports: [HeaderComponent],
  templateUrl: './subjects-page.component.html',
})
export class SubjectsPageComponent extends TailwindWrapperComponent implements OnInit {
  private readonly subjectsService = inject(SubjectsService);
  private readonly subjectsState = signal<Subject[] | null>(null);

  public readonly subjects = this.subjectsState.asReadonly();

  loadSubjects(): Observable<Subject[]> {
    return this.subjectsService
      .getAllSubjects()
      .pipe(tap((subjects) => this.subjectsState.set(subjects)));
  }

  ngOnInit(): void {
    this.loadSubjects().subscribe();
  }
}
