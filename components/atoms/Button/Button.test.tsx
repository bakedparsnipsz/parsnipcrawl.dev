import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" variant="primary" size="medium" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button label="Go" variant="primary" size="medium" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button label="Go" variant="primary" size="medium" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button label="Go" variant="primary" size="medium" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it.each(['primary', 'secondary', 'boss', 'combat', 'destructive', 'success'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() =>
        render(<Button label="x" variant={variant} size="medium" />),
      ).not.toThrow();
    },
  );

  it.each(['small', 'medium', 'large'] as const)(
    'renders size "%s" without throwing',
    (size) => {
      expect(() =>
        render(<Button label="x" variant="primary" size={size} />),
      ).not.toThrow();
    },
  );
});
