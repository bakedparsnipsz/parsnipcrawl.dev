import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders children', () => {
    render(<Typography variant="body" asChild={false}>Hello</Typography>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders as a <p> by default', () => {
    render(<Typography variant="body" asChild={false}>Text</Typography>);
    expect(screen.getByText('Text').tagName).toBe('P');
  });

  it('renders as a child element when asChild is true', () => {
    render(
      <Typography variant="body" asChild>
        <h1>Heading</h1>
      </Typography>,
    );
    expect(screen.getByText('Heading').tagName).toBe('H1');
  });

  it.each([
    'display-primary-large',
    'display-secondary-large',
    'display-secondary-medium',
    'display-secondary-small',
    'display-secondary-xsmall',
    'body',
    'body-small',
    'body--xsmall',
  ] as const)('renders variant "%s" without throwing', (variant) => {
    expect(() =>
      render(<Typography variant={variant} asChild={false}>x</Typography>),
    ).not.toThrow();
  });
});
