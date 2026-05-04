import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders the title', () => {
    render(<Toast title="Room Cleared" variant="success" />);
    expect(screen.getByText('Room Cleared')).toBeInTheDocument();
  });

  it('renders the message when provided', () => {
    render(<Toast title="Room Cleared" message="+850 XP earned" variant="success" />);
    expect(screen.getByText('+850 XP earned')).toBeInTheDocument();
  });

  it('does not render a message element when message is omitted', () => {
    render(<Toast title="Room Cleared" variant="success" />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<Toast title="Alert" variant="encounter" onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<Toast title="Alert" variant="encounter" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<Toast title="Alert" variant="encounter" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('uses role="alert" for encounter variant', () => {
    render(<Toast title="!" variant="encounter" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role="status" for success variant', () => {
    render(<Toast title="Done" variant="success" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses role="status" for loot variant', () => {
    render(<Toast title="Loot!" variant="loot" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('sets aria-live="assertive" for encounter', () => {
    render(<Toast title="!" variant="encounter" />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('sets aria-live="polite" for non-encounter variants', () => {
    render(<Toast title="Done" variant="success" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
