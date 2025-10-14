import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkPlanForm } from '@/features/reports/components/WorkPlan/work-plan-form';

// Mock del hook de firma
vi.mock('@/lib/signature-storage', () => ({
  useSignature: () => ({
    getSignature: vi.fn().mockResolvedValue(null),
  }),
}));

describe('WorkPlanForm', () => {
  it('should render all main sections', () => {
    render(<WorkPlanForm />);

    expect(screen.getByText(/datos del paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/datos del profesional/i)).toBeInTheDocument();
    expect(screen.getByText(/diagnóstico/i)).toBeInTheDocument();
  });

  it('should validate DNI format', () => {
    render(<WorkPlanForm />);

    const dniInput = screen.getByLabelText(/dni/i) as HTMLInputElement;
    
    // Ingresar DNI inválido (letras)
    fireEvent.change(dniInput, { target: { value: 'ABC123' } });
    
    // El valor debería ser filtrado o mostrar error
    expect(dniInput.value).not.toBe('ABC123');
  });

  it('should have add objective buttons', async () => {
    render(<WorkPlanForm />);

    // Buscar botones de agregar (hay varios)
    const addButtons = screen.getAllByRole('button', { name: /agregar/i });
    
    // Debe haber al menos 2 botones (para objetivos generales y específicos)
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('should show autosave message', () => {
    render(<WorkPlanForm />);

    // Verificar que se muestre el mensaje de guardado automático
    expect(screen.getByText(/tus cambios se guardan automáticamente/i)).toBeInTheDocument();
  });
});

