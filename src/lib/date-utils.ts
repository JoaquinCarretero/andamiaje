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
 * Calcula la edad a partir de una fecha de nacimiento.
 * Si la edad es menor a 10 años, devuelve un string con años y meses.
 * @param birthDate La fecha de nacimiento (string o Date).
 * @returns La edad calculada en años, o en años y meses si es menor de 10.
 */
export const calculateAge = (birthDate: string | Date): number | string => {
  try {
    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      return 0;
    }

    let totalMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());

    if (today.getDate() < birth.getDate()) {
      totalMonths--;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years < 0) return 0;

    if (years < 10) {
      const yearText = years > 0 ? `${years} ${years === 1 ? 'año' : 'años'}` : '';
      const monthText = months > 0 ? `${months} ${months === 1 ? 'mes' : 'meses'}` : '';

      if (yearText && monthText) {
        return `${yearText} y ${monthText}`;
      }
      if (yearText) return yearText;
      if (monthText) return monthText;
      return "Menos de un mes";
    }

    return years;
  } catch (error) {
    console.error("Error al calcular edad:", error);
    return "Edad inválida";
  }
};
