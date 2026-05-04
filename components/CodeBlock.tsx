'use client';

import { useState } from 'react';
import styles from './CodeBlock.module.css';

interface Props {
  lang: string;
  code: string;
}

export function CodeBlock({ lang, code }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const tokens = tokenize(code, lang);

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.lang}>{lang}</span>
        <button
          className={`${styles.copyBtn}${copied ? ` ${styles.copied}` : ''}`}
          onClick={handleCopy}
        >
          {copied ? '[ COPIED ]' : '[ COPY ]'}
        </button>
      </div>
      <div className={styles.body}>
        <pre dangerouslySetInnerHTML={{ __html: tokens }} />
      </div>
    </div>
  );
}

/* ─── Minimal syntax highlighter ────────────────────────────────────────── */
function tokenize(code: string, lang: string): string {
  /* For languages we can pattern-match on */
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const isJS = ['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'].includes(lang);
  const isCSS = ['css', 'scss'].includes(lang);

  if (isJS) return highlightJS(escaped);
  if (isCSS) return highlightCSS(escaped);
  return escaped;
}

function span(cls: string, content: string) {
  return `<span class="${cls}">${content}</span>`;
}

function highlightJS(code: string): string {
  const KEYWORDS =
    /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|default|from|new|this|typeof|instanceof|async|await|of|in|true|false|null|undefined|void|type|interface|enum)\b/g;
  const STRINGS = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  const COMMENTS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const NUMBERS = /\b(\d+(?:\.\d+)?)\b/g;
  const TYPES = /\b([A-Z][a-zA-Z0-9]*)\b/g;
  const FNS = /\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  const placeholders: string[] = [];

  let result = code;

  /* Comments first (highest priority) */
  result = result.replace(COMMENTS, (m) => {
    const idx = placeholders.push(span(`__TOKEN__${styles.cmt}`, m)) - 1;
    return `\x00${idx}\x00`;
  });

  /* Strings */
  result = result.replace(STRINGS, (m) => {
    const idx = placeholders.push(span(`__TOKEN__${styles.str}`, m)) - 1;
    return `\x00${idx}\x00`;
  });

  /* Numbers */
  result = result.replace(NUMBERS, (_, n) => span(`__TOKEN__${styles.num}`, n));

  /* Types */
  result = result.replace(TYPES, (_, t) => span(`__TOKEN__${styles.ty}`, t));

  /* Functions */
  result = result.replace(FNS, (_, f) => span(`__TOKEN__${styles.fn}`, f));

  /* Keywords */
  result = result.replace(KEYWORDS, (_, k) => span(`__TOKEN__${styles.kw}`, k));

  /* Restore placeholders */
  // eslint-disable-next-line no-control-regex
  result = result.replace(/\x00(\d+)\x00/g, (_, i) => placeholders[Number(i)]);

  /* Replace class prefix with actual CSS module class */
  result = result.replace(
    /__TOKEN__([a-z_-]+)/g,
    (_, cls) => `${styles[cls as keyof typeof styles] ?? cls}`,
  );

  return result;
}

function highlightCSS(code: string): string {
  const PROP = /([a-z-]+)\s*(?=:)/g;
  const VALUE = /:\s*([^;{}]+)/g;
  const SELECTOR = /^([.#:[\w*>+~, \n]+)\s*\{/gm;

  let result = code;
  result = result.replace(SELECTOR, (m, sel) => m.replace(sel, span(styles.fn, sel)));
  result = result.replace(PROP, (m, p) => m.replace(p, span(styles.kw, p)));
  result = result.replace(VALUE, (m, v) => m.replace(v, span(styles.str, v)));
  return result;
}
