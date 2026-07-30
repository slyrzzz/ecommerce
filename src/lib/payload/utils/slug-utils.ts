import type { FieldHook } from 'payload';

/**
 * Convierte un texto en un slug SEO-friendly en minúsculas y separado por guiones.
 * Compatible con caracteres en español (tildes, acentos, diacríticos, eñes).
 *
 * Ejemplo:
 * - "Gamuza Blanca 100% Algodón" -> "gamuza-blanca-100-algodon"
 * - "Línea Clásica & Deportiva" -> "linea-clasica-deportiva"
 */
export const formatSlugString = (val: string): string => {
  if (!val || typeof val !== 'string') return '';

  return val
    .normalize('NFD') // Descompone caracteres con acento (ej. 'á' -> 'a' + '́')
    .replace(/[\u0300-\u036f]/g, '') // Elimina las marcas diacríticas
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplaza uno o más espacios con un solo guion
    .replace(/_/g, '-') // Reemplaza guiones bajos por guiones normales
    .replace(/[^\w-]+/g, '') // Elimina cualquier carácter especial que no sea letra, número o guion
    .replace(/--+/g, '-') // Evita guiones consecutivos redundantes
    .replace(/^-+|-+$/g, ''); // Quita guiones iniciales o finales
};

/**
 * Hook del servidor `beforeValidate` para campos `slug` de Payload CMS.
 * Si el usuario no especificó un slug (o es nuevo), lo genera automáticamente
 * a partir del campo original (ej. 'title'). Si el usuario sí escribió un slug,
 * lo formatea para asegurar que sea válido en URLs.
 */
export const formatSlugHook =
  (fallbackField: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return formatSlugString(value);
    }

    const fallbackData = data?.[fallbackField] || originalDoc?.[fallbackField];

    if (fallbackData && typeof fallbackData === 'string') {
      return formatSlugString(fallbackData);
    }

    return value;
  };
