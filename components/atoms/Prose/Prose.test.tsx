import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Prose } from './Prose';

describe('Prose', () => {
  it('renders children', () => {
    render(
      <Prose>
        <p>Hello world</p>
      </Prose>,
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders as an article element', () => {
    render(<Prose>content</Prose>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    render(<Prose className="my-custom">content</Prose>);
    expect(screen.getByRole('article').className).toContain('my-custom');
  });

  it('renders complex children', () => {
    render(
      <Prose>
        <h2>Chapter One</h2>
        <p>Body text here.</p>
        <code>inline code</code>
      </Prose>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Body text here.')).toBeInTheDocument();
    expect(screen.getByText('inline code')).toBeInTheDocument();
  });
});
