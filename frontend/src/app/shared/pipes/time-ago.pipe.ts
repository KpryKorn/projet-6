import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
    const abs = Math.abs(seconds);
    if (abs < 60) return 'à l’instant';
    for (const [unit, size] of units) {
      if (abs >= size) return formatter.format(Math.trunc(seconds / size), unit);
    }
    return 'à l’instant';
  }
}
