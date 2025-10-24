/**
 * Formatea una fecha a DD/MM/YYYY.
 * @param date La fecha a formatear (string o Date).
 * @returns La fecha formateada.
 */
export const formatDate = (date: string | Date): string => {
  try {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

/**
 * Calcula la edad a partir de una fecha de nacimiento, evitando valores negativos.
 * @param birthDate La fecha de nacimiento (string o Date).
 * @returns La edad calculada.
 */
export const calculateAge = (birthDate: string | Date): number | string => {
  try {
    const d = new Date(birthDate);
    const today = new Date();

    if (d > today) {
      return 0; // O manejar como error, por ahora 0 si la fecha es futura
    }

    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }

    return age < 0 ? 0 : age;
  } catch (error) {
    console.error("Error al calcular edad:", error);
    return "Edad inválida";
  }
};
