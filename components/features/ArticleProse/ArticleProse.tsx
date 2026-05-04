import { Prose } from '../../../components/atoms/Prose/Prose';
import { CodeBlock } from '../../../components/atoms/CodeBlock/CodeBlock';

interface Props {
  content: string;
}

/* ─── Minimal markdown-to-JSX renderer ──────────────────────────────────── */
export function ArticleProse({ content }: Props) {
  const blocks = parseBlocks(content);
  return (
    <Prose>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </Prose>
  );
}

/* ─── Block types ────────────────────────────────────────────────────────── */
type BlockNode =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function Block({ block }: { block: BlockNode }) {
  if (block.type === 'h2') return <h2>{inlineFormat(block.text)}</h2>;
  if (block.type === 'h3') return <h3>{inlineFormat(block.text)}</h3>;
  if (block.type === 'p') return <p>{inlineFormat(block.text)}</p>;
  if (block.type === 'code') return <CodeBlock lang={block.lang} code={block.code} />;
  if (block.type === 'ul')
    return (
      <ul>
        {block.items.map((it, i) => (
          <li key={i}>{inlineFormat(it)}</li>
        ))}
      </ul>
    );
  if (block.type === 'ol')
    return (
      <ol>
        {block.items.map((it, i) => (
          <li key={i}>{inlineFormat(it)}</li>
        ))}
      </ol>
    );
  return null;
}

/* ─── Inline formatting ──────────────────────────────────────────────────── */
function inlineFormat(text: string): React.ReactNode {
  /* Split on **bold**, *italic*, `code` */
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

/* ─── Block parser ───────────────────────────────────────────────────────── */
function parseBlocks(md: string): BlockNode[] {
  const lines = md.split('\n');
  const blocks: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Fenced code block */
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      i++;
      continue;
    }

    /* Headings */
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) });
      i++;
      continue;
    }

    /* Unordered list */
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    /* Ordered list */
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    /* Paragraph — accumulate non-empty lines */
    if (line.trim()) {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('```') &&
        !lines[i].startsWith('- ') &&
        !lines[i].startsWith('* ') &&
        !/^\d+\. /.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'p', text: paraLines.join(' ') });
      continue;
    }

    i++;
  }

  return blocks;
}
