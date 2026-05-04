'use client';

import { useState } from 'react';
import styles from './CodeBlock.module.css';

export type CodeBlockProps = {
  lang: string;
  code: string;
};

export function CodeBlock({ lang, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.lang}>{lang.toUpperCase()}</span>
        <button
          className={[styles.copyBtn, copied && styles.copied].filter(Boolean).join(' ')}
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? '[ COPIED ]' : '[ COPY ]'}
        </button>
      </div>
      <div className={styles.body}>
        <pre dangerouslySetInnerHTML={{ __html: tokenize(code, lang) }} />
      </div>
    </div>
  );
}

/* ── Syntax highlighter ──────────────────────────────────────────────────── */

function tokenize(code: string, lang: string): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const isJS = ['js', 'jsx', 'ts', 'tsx', 'javascript', 'typescript'].includes(lang);
  const isCSS = ['css', 'scss'].includes(lang);
  const isRS = ['rs', 'rust'].includes(lang);

  if (isJS) return highlightJS(escaped);
  if (isCSS) return highlightCSS(escaped);
  if (isRS) return highlightRust(escaped);
  return escaped;
}

function span(cls: string, content: string) {
  return `<span class="${styles[cls as keyof typeof styles] ?? cls}">${content}</span>`;
}

function highlightJS(code: string): string {
  const KEYWORDS =
    /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|default|from|new|this|typeof|instanceof|async|await|of|in|true|false|null|undefined|void|type|interface|enum)\b/g;
  const STRINGS = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  const COMMENTS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const NUMBERS = /\b(\d+(?:\.\d+)?)\b/g;
  const TYPES = /\b([A-Z][a-zA-Z0-9]*)\b/g;
  const FNS = /\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  return applyTokens(code, { COMMENTS, STRINGS, NUMBERS, TYPES, FNS, KEYWORDS });
}

function highlightRust(code: string): string {
  const KEYWORDS =
    /\b(fn|let|mut|pub|use|mod|struct|enum|impl|trait|for|in|if|else|match|return|self|Self|super|where|type|const|static|async|await|move|ref|loop|while|break|continue|true|false|Some|None|Ok|Err)\b/g;
  const STRINGS = /("(?:[^"\\]|\\.)*")/g;
  const COMMENTS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const NUMBERS = /\b(\d+(?:\.\d+)?(?:u8|u16|u32|u64|i8|i16|i32|i64|f32|f64|usize|isize)?)\b/g;
  const TYPES = /\b([A-Z][a-zA-Z0-9]*)\b/g;
  const MACROS = /\b([a-z_][a-zA-Z0-9_]*!)\s*(?=[({[])/g;
  const FNS = /\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  return applyTokens(code, { COMMENTS, STRINGS, MACROS, NUMBERS, TYPES, FNS, KEYWORDS });
}

function highlightCSS(code: string): string {
  const COMMENTS = /(\/\*[\s\S]*?\*\/)/g;
  const STRINGS = /(["'])(?:(?!\1)[^\\]|\\.)*?\1/g;
  const AT_RULE = /(@[a-z-]+)/g;
  const PROP = /([a-z-]+)\s*(?=:)/g;
  const VALUE = /:\s*([^;{}]+)/g;

  return applyTokens(code, { COMMENTS, STRINGS, AT_RULE, PROP, VALUE });
}

type RuleMap = Record<string, RegExp>;
const RULE_CLASS: Record<string, string> = {
  KEYWORDS: 'kw',
  STRINGS: 'str',
  COMMENTS: 'cmt',
  NUMBERS: 'num',
  TYPES: 'ty',
  FNS: 'fn',
  MACROS: 'mac',
  PROP: 'kw',
  VALUE: 'str',
  AT_RULE: 'kw',
};

function applyTokens(code: string, rules: RuleMap): string {
  const placeholders: string[] = [];

  let result = code;

  for (const [ruleName, regex] of Object.entries(rules)) {
    const cls = RULE_CLASS[ruleName] ?? 'var';
    result = result.replace(regex, (m) => {
      const idx = placeholders.push(span(cls, m)) - 1;
      return `\x00${idx}\x00`;
    });
  }

  // eslint-disable-next-line no-control-regex
  return result.replace(/\x00(\d+)\x00/g, (_, i) => placeholders[Number(i)]);
}
