import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import go from 'highlight.js/lib/languages/go';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const languages: Record<string, typeof bash> = {
  bash,
  csharp,
  css,
  diff,
  go,
  ini,
  java,
  javascript,
  json,
  kotlin,
  python,
  rust,
  sql,
  typescript,
  xml,
  yaml,
};
Object.entries(languages).forEach(([name, definition]) => hljs.registerLanguage(name, definition));
hljs.registerAliases(['tsx'], { languageName: 'typescript' });
hljs.registerAliases(['properties'], { languageName: 'ini' });

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private readonly marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight: (code, lang) =>
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang }).value
          : code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    }),
    { gfm: true, breaks: true },
  );

  /** Markdown in, sanitized HTML out. Never bind the raw result without this step. */
  render(source: string): string {
    const html = this.marked.parse(source, { async: false });
    return DOMPurify.sanitize(html);
  }
}
