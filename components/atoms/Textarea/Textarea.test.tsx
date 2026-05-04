import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Textarea label="NOTES" />);
    expect(screen.getByLabelText('NOTES')).toBeInTheDocument();
  });

  it('associates label with textarea via htmlFor/id', () => {
    render(<Textarea label="LORE" />);
    expect(screen.getByLabelText('LORE').tagName).toBe('TEXTAREA');
  });

  it('uses an explicit id when provided', () => {
    render(<Textarea label="BIO" id="my-textarea" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
  });

  it('forwards placeholder', () => {
    render(<Textarea placeholder="Write here..." />);
    expect(screen.getByPlaceholderText('Write here...')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards rows attribute', () => {
    render(<Textarea rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });

  it('applies a custom className to the textarea', () => {
    render(<Textarea className="extra" />);
    expect(screen.getByRole('textbox')).toHaveClass('extra');
  });
});
