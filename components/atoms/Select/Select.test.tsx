import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectItem } from './Select';

describe('Select', () => {
  function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
    return render(
      <Select placeholder="Choose..." {...props}>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </Select>,
    );
  }

  it('renders the trigger button', () => {
    renderSelect();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder text before selection', () => {
    renderSelect({ placeholder: 'Pick one' });
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    renderSelect({ label: 'CLASS' });
    expect(screen.getByText('CLASS')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is set', () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('opens the listbox on click', async () => {
    renderSelect();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('calls onValueChange with the selected value', async () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Option A' }));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('shows the defaultValue on render', () => {
    renderSelect({ defaultValue: 'b' });
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });
});

describe('SelectItem', () => {
  it('is disabled when the disabled prop is set', async () => {
    render(
      <Select placeholder="Pick">
        <SelectItem value="locked" disabled>Locked</SelectItem>
        <SelectItem value="open">Open</SelectItem>
      </Select>,
    );
    await userEvent.click(screen.getByRole('combobox'));
    const option = screen.getByRole('option', { name: 'Locked' });
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });
});
