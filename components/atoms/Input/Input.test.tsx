import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="USERNAME" />);
    expect(screen.getByLabelText('USERNAME')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor/id', () => {
    render(<Input label="EMAIL" />);
    const input = screen.getByLabelText('EMAIL');
    expect(input.tagName).toBe('INPUT');
  });

  it('uses an explicit id when provided', () => {
    render(<Input label="NAME" id="my-input" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
  });

  it('forwards placeholder', () => {
    render(<Input placeholder="Enter name..." />);
    expect(screen.getByPlaceholderText('Enter name...')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards type attribute', () => {
    render(<Input type="password" />);
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('applies a custom className to the input', () => {
    render(<Input className="extra" />);
    expect(screen.getByRole('textbox')).toHaveClass('extra');
  });
});
