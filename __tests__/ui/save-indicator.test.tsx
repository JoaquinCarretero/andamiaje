import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SaveIndicator, useAutoSave } from '@/ui';
import { renderHook, act } from '@testing-library/react';

describe('SaveIndicator', () => {
  it('should render "Guardando..." when status is saving', () => {
    render(<SaveIndicator status="saving" />);
    expect(screen.getByText(/guardando/i)).toBeInTheDocument();
  });

  it('should render "Guardado correctamente" when status is saved', () => {
    render(<SaveIndicator status="saved" />);
    expect(screen.getByText(/guardado correctamente/i)).toBeInTheDocument();
  });

  it('should render time ago when lastSaved is provided', () => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    render(<SaveIndicator status="saved" lastSaved={oneMinuteAgo} />);
    expect(screen.getByText(/guardado hace/i)).toBeInTheDocument();
  });

  it('should render error message when status is error', () => {
    render(<SaveIndicator status="error" errorMessage="Error de conexión" />);
    expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
  });

  it('should not render when status is idle', () => {
    const { container } = render(<SaveIndicator status="idle" />);
    // El componente no renderiza nada cuando status es idle
    expect(container.firstChild).toBeNull();
  });
});

describe('useAutoSave', () => {
  it('should call onSave after debounce', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    
    const { result } = renderHook(() =>
      useAutoSave({
        onSave,
        debounceMs: 100,
      })
    );

    act(() => {
      result.current.triggerSave({ test: 'data' });
    });

    expect(result.current.saveStatus).toBe('saving');

    await waitFor(() => {
      expect(result.current.saveStatus).toBe('saved');
    });

    expect(onSave).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should set error status when onSave fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Network error'));
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useAutoSave({
        onSave,
        onError,
        debounceMs: 100,
      })
    );

    act(() => {
      result.current.triggerSave({ test: 'data' });
    });

    await waitFor(() => {
      expect(result.current.saveStatus).toBe('error');
    });

    expect(onError).toHaveBeenCalled();
  });
});

