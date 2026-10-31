import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();
  const ago = (seconds: number) => new Date(Date.now() - seconds * 1000).toISOString();

  it('returns an empty string without a value', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('says "à l’instant" under a minute', () => {
    expect(pipe.transform(ago(20))).toBe('à l’instant');
  });

  it('formats hours and days in French', () => {
    expect(pipe.transform(ago(3 * 3600 + 5))).toBe('il y a 3 heures');
    expect(pipe.transform(ago(2 * 86400 + 5))).toBe('avant-hier');
  });
});
