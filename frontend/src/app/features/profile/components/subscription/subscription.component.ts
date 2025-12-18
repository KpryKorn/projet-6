import { Component, input, output } from '@angular/core';
import { Subject } from '@models/subject';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subscription',
  imports: [ButtonModule],
  templateUrl: './subscription.component.html',
  host: {
    class: 'contents',
  },
})
export class SubscriptionComponent {
  subject = input.required<Subject>();

  onUnsubscribe = output<number>();

  unsubscribe() {
    this.onUnsubscribe.emit(this.subject().id);
  }
}
