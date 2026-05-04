import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillPips } from './SkillPips';

function getPips(container: HTMLElement) {
  // The pip divs are siblings inside the .row wrapper
  return container.querySelectorAll('[class*="pip"]:not([class*="wrapper"]):not([class*="label"]):not([class*="row"])');
}

describe('SkillPips', () => {
  it('renders the correct total number of pips', () => {
    const { container } = render(<SkillPips filled={2} total={5} />);
    expect(getPips(container)).toHaveLength(5);
  });

  it('defaults to 5 total pips', () => {
    const { container } = render(<SkillPips filled={3} />);
    expect(getPips(container)).toHaveLength(5);
  });

  it('renders a label when provided', () => {
    const { getByText } = render(<SkillPips filled={2} total={5} label="ARCANE" />);
    expect(getByText('ARCANE')).toBeInTheDocument();
  });

  it('has the correct ARIA meter role', () => {
    const { getByRole } = render(<SkillPips filled={3} total={5} />);
    expect(getByRole('meter')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the clamped filled count', () => {
    const { getByRole } = render(<SkillPips filled={3} total={5} />);
    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '3');
  });

  it('clamps filled above total to total', () => {
    const { getByRole } = render(<SkillPips filled={10} total={5} />);
    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '5');
  });

  it('clamps filled below 0 to 0', () => {
    const { getByRole } = render(<SkillPips filled={-3} total={5} />);
    expect(getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets aria-valuemax to total', () => {
    const { getByRole } = render(<SkillPips filled={2} total={7} />);
    expect(getByRole('meter')).toHaveAttribute('aria-valuemax', '7');
  });

  it.each(['purple', 'gold', 'red'] as const)(
    'renders variant "%s" without throwing',
    (variant) => {
      expect(() => render(<SkillPips filled={3} total={5} variant={variant} />)).not.toThrow();
    },
  );
});
