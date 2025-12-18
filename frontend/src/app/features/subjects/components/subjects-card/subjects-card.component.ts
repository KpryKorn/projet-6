import { Component, input, output } from '@angular/core';
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
  subject = input.required<Subject>();
  isSubscribed = input<boolean>(false);

  onSubscribe = output<number>();

  subscribe() {
    this.onSubscribe.emit(this.subject().id);
  }
}
