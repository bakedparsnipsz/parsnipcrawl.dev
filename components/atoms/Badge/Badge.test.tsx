import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the label', () => {
    render(<Badge label="#rust" variant="default" textVariant="uppercase" />);
    expect(screen.getByText('#rust')).toBeInTheDocument();
  });

  it('renders as a span', () => {
    render(<Badge label="test" variant="default" textVariant="uppercase" />);
    expect(screen.getByText('test').tagName).toBe('SPAN');
  });

  it('applies a custom className', () => {
    render(<Badge label="test" variant="default" textVariant="uppercase" className="extra" />);
    expect(screen.getByText('test')).toHaveClass('extra');
  });

  it.each(['default', 'outlined', 'gold', 'red', 'green', 'boss'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() =>
        render(<Badge label="x" variant={variant} textVariant="uppercase" />),
      ).not.toThrow();
    },
  );

  it.each(['uppercase', 'capitalised', 'lowercase'] as const)(
    'renders textVariant "%s" without throwing',
    (textVariant) => {
      expect(() =>
        render(<Badge label="x" variant="default" textVariant={textVariant} />),
      ).not.toThrow();
    },
  );
});
