import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  it('renders the language label in uppercase', () => {
    render(<CodeBlock lang="ts" code="const x = 1;" />);
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('renders the copy button', () => {
    render(<CodeBlock lang="js" code="console.log(42);" />);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('renders the code in a pre element', () => {
    const { container } = render(<CodeBlock lang="ts" code="const x = 1;" />);
    expect(container.querySelector('pre')).toBeInTheDocument();
  });

  it('calls clipboard.writeText with the code on copy click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CodeBlock lang="js" code="const y = 2;" />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('const y = 2;');
  });

  it('shows "[ COPIED ]" label after clicking copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CodeBlock lang="js" code="x" />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('[ COPIED ]');
  });

  it('renders without throwing for JS', () => {
    expect(() => render(<CodeBlock lang="js" code="const x = 1;" />)).not.toThrow();
  });

  it('renders without throwing for TS', () => {
    expect(() => render(<CodeBlock lang="ts" code="type Foo = string;" />)).not.toThrow();
  });

  it('renders without throwing for Rust', () => {
    expect(() => render(<CodeBlock lang="rs" code="fn main() {}" />)).not.toThrow();
  });

  it('renders without throwing for CSS', () => {
    expect(() => render(<CodeBlock lang="css" code=".foo { color: red; }" />)).not.toThrow();
  });

  it('renders without throwing for an unknown language', () => {
    expect(() => render(<CodeBlock lang="python" code="print('hi')" />)).not.toThrow();
  });
});
