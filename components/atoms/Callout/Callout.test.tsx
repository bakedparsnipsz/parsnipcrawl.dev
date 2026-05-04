import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders children', () => {
    render(<Callout variant="info">Body text here</Callout>);
    expect(screen.getByText('Body text here')).toBeInTheDocument();
  });

  it('renders the default heading for each variant', () => {
    const cases: Array<[React.ComponentProps<typeof Callout>['variant'], string]> = [
      ['lore', '[ LORE DROP ]'],
      ['warn', '[ TRAP AHEAD ]'],
      ['danger', '[ DANGER ]'],
      ['info', '[ ARCANE NOTE ]'],
    ];

    for (const [variant, heading] of cases) {
      const { unmount } = render(<Callout variant={variant}>x</Callout>);
      expect(screen.getByText(heading)).toBeInTheDocument();
      unmount();
    }
  });

  it('uses a custom heading when provided', () => {
    render(
      <Callout variant="lore" heading="[ BOSS LORE ]">
        x
      </Callout>,
    );
    expect(screen.getByText('[ BOSS LORE ]')).toBeInTheDocument();
    expect(screen.queryByText('[ LORE DROP ]')).not.toBeInTheDocument();
  });

  it('renders complex children', () => {
    render(
      <Callout variant="info">
        Avoid <code>Box&lt;dyn Trait&gt;</code> here.
      </Callout>,
    );
    expect(screen.getByText(/Avoid/)).toBeInTheDocument();
  });

  it.each(['lore', 'warn', 'danger', 'info'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() => render(<Callout variant={variant}>x</Callout>)).not.toThrow();
    },
  );
});
