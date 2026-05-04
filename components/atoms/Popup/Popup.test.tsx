import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Popup } from './Popup';

describe('Popup', () => {
  it('renders children', () => {
    render(<Popup variant="xp">+850 XP</Popup>);
    expect(screen.getByText('+850 XP')).toBeInTheDocument();
  });

  it('has role="status"', () => {
    render(<Popup variant="xp">+850 XP</Popup>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<Popup variant="xp">+100</Popup>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it.each(['xp', 'gold', 'combat', 'encounter'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() => render(<Popup variant={variant}>text</Popup>)).not.toThrow();
    },
  );

  it('renders complex children', () => {
    render(
      <Popup variant="gold">
        <span>+240</span> Gold
      </Popup>,
    );
    expect(screen.getByText('+240')).toBeInTheDocument();
    expect(screen.getByText('Gold', { exact: false })).toBeInTheDocument();
  });
});
