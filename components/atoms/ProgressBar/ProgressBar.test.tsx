import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct ARIA role', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the provided value', () => {
    render(<ProgressBar value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin to 0 and aria-valuemax to 100', () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps value above 100 to 100', () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps value below 0 to 0', () => {
    render(<ProgressBar value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders a label when provided', () => {
    render(<ProgressBar value={50} label="HP" />);
    expect(screen.getByText('HP')).toBeInTheDocument();
  });

  it('renders a valueLabel when provided', () => {
    render(<ProgressBar value={80} label="HP" valueLabel="80/100" />);
    expect(screen.getByText('80/100')).toBeInTheDocument();
  });

  it('sets aria-label from label prop', () => {
    render(<ProgressBar value={50} label="XP" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'XP');
  });

  it.each(['hp', 'xp', 'progress', 'gold', 'green'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() => render(<ProgressBar value={50} variant={variant} />)).not.toThrow();
    },
  );

  it.each(['thin', 'medium', 'thick'] as const)('renders size "%s" without throwing', (size) => {
    expect(() => render(<ProgressBar value={50} size={size} />)).not.toThrow();
  });
});
