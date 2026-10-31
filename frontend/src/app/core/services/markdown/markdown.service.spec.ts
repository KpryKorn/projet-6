import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(MarkdownService);
  });

  it('renders headings and emphasis', () => {
    const html = service.render('## Titre\n\nUn **mot** important');
    expect(html).toContain('<h2');
    expect(html).toContain('<strong>mot</strong>');
  });

  it('highlights fenced code in a known language', () => {
    const html = service.render('```ts\nconst a = 1;\n```');
    expect(html).toContain('hljs-keyword');
  });

  it('strips scripts and inline handlers', () => {
    const html = service.render('<img src=x onerror="alert(1)"><script>alert(1)</script>');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<script');
  });

  it('opens links in a new tab safely', () => {
    const html = service.render('[doc](https://example.com)');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
