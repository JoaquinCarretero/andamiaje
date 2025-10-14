import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmationDialog, useConfirmation } from '@/ui';
import { renderHook, act } from '@testing-library/react';

function TestComponent() {
  const { confirm, ConfirmDialog } = useConfirmation();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: '¿Eliminar elemento?',
      description: 'Esta acción no se puede deshacer',
      confirmText: 'Eliminar',
    });

    if (confirmed) {
      // Acción confirmada
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Eliminar</button>
      <ConfirmDialog />
    </div>
  );
}

describe('ConfirmationDialog', () => {
  it('should render title and description', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onOpenChange={() => {}}
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="¿Confirmar acción?"
        description="Esta acción es irreversible"
      />
    );

    expect(screen.getByText('¿Confirmar acción?')).toBeInTheDocument();
    expect(screen.getByText('Esta acción es irreversible')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onOpenChange={() => {}}
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="Confirmar"
        description="Descripción"
        confirmText="Confirmar"
      />
    );

    const confirmButton = screen.getByText('Confirmar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onOpenChange={() => {}}
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="Confirmar"
        description="Descripción"
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should not render when isOpen is false', () => {
    const onConfirm = vi.fn();

    const { container } = render(
      <ConfirmationDialog
        isOpen={false}
        onOpenChange={() => {}}
        onConfirm={onConfirm}
        title="Confirmar"
        description="Descripción"
      />
    );

    expect(container.querySelector('[role="alertdialog"]')).not.toBeInTheDocument();
  });
});

describe('useConfirmation', () => {
  it('should return confirm function and ConfirmDialog component', () => {
    const { result } = renderHook(() => useConfirmation());

    expect(result.current.confirm).toBeDefined();
    expect(result.current.ConfirmDialog).toBeDefined();
    expect(typeof result.current.confirm).toBe('function');
  });

  it('should show dialog when confirm is called', async () => {
    render(<TestComponent />);

    const deleteButton = screen.getByText('Eliminar');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('¿Eliminar elemento?')).toBeInTheDocument();
    });
  });
});

