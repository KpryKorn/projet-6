import { Component, Input } from '@angular/core';
import { Subject } from '@models/subject';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subjects-card',
  imports: [ButtonModule],
  templateUrl: './subjects-card.component.html',
  host: {
    class: 'contents',
  },
})
export class SubjectsCardComponent {
  @Input({ required: true }) subject!: Subject;
}
