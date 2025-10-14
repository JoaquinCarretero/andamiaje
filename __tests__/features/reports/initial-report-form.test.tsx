import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InitialReportForm } from '@/features/reports/components/InitialReport/initial-report-form';

// Mock del hook de firma
vi.mock('@/lib/signature-storage', () => ({
  useSignature: () => ({
    getSignature: vi.fn().mockResolvedValue(null),
  }),
}));

describe('InitialReportForm', () => {
  it('should render all form fields', () => {
    render(<InitialReportForm />);

    expect(screen.getByLabelText(/nombre del paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/diagnóstico/i)).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    render(<InitialReportForm />);

    const sendButton = screen.getByRole('button', { name: /enviar informe/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      // Al menos un error debe aparecer
      const alerts = screen.queryAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it('should update form values when typing', () => {
    render(<InitialReportForm />);

    const nameInput = screen.getByLabelText(/paciente.*nombre completo/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });

    expect(nameInput.value).toBe('Juan Pérez');
  });

  it('should have save draft button', async () => {
    render(<InitialReportForm />);

    // Verificar que existe el botón de guardar borrador
    const saveButton = screen.getByRole('button', { name: /guardar borrador/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });
});

