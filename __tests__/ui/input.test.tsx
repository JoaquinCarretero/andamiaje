import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/ui';

describe('Input', () => {
  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should update value on change', () => {
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(input.value).toBe('new value');
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should have type attribute', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('should support password type', () => {
    render(<Input type="password" />);
    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toHaveAttribute('type', 'password');
  });
});

