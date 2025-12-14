import { Component, inject, OnInit, signal } from '@angular/core';
import { Subject } from '@models/subject';
import { SubjectsService } from '@services/api/subjects/subjects.service';
import { Observable, tap } from 'rxjs';
import { HeaderComponent } from '@components/header/header.component';
import { SubjectsCardComponent } from '../../components/subjects-card/subjects-card.component';

@Component({
  selector: 'app-subjects-page',
  imports: [HeaderComponent, SubjectsCardComponent],
  templateUrl: './subjects-page.component.html',
  host: { class: 'contents' },
})
export class SubjectsPageComponent implements OnInit {
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
