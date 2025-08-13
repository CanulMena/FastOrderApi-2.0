
export const regularExps = {

  // email
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  password: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

  /**
 * Expresión regular para validar cadenas con formato ISO 8601 completo en UTC (sin zona horaria explícita, solo 'Z')
 * Formato esperado:
 *   YYYY-MM-DDThh:mm:ss[.sss]Z
 *
 * Donde:
 *  - YYYY: año de 4 dígitos (ej. 2025)
 *  - MM: mes de 2 dígitos (01 a 12) — *no valida rango real*
 *  - DD: día de 2 dígitos (01 a 31) — *no valida rango real*
 *  - T: separador literal
 *  - hh: hora en formato 24h de 2 dígitos (00 a 23) — *no valida rango real*
 *  - mm: minutos de 2 dígitos (00 a 59)
 *  - ss: segundos de 2 dígitos (00 a 59)
 *  - [.sss]: opcional, fracciones de segundo precedidas por punto
 *  - Z: indica zona horaria UTC (obligatorio)
 *
 * Esta expresión sólo valida el formato, NO valida rangos reales de fecha y hora.
 *
 * Ejemplos que acepta (regresa true):
 *   "2025-08-07T14:30:00Z"
 *   "1999-12-31T23:59:59Z"
 *   "2020-01-01T00:00:00.123Z"
 *
 * Ejemplos que NO acepta (regresa false):
 *   "2025-8-7T14:30:00Z"          // mes y día no tienen 2 dígitos
 *   "2025-08-07 14:30:00Z"        // falta la T
 *   "2025-08-07T14:30:00"         // falta la Z final
 *   "2025-08-07T14:30Z"           // faltan segundos
 *   "2025-08-07T14:30:00+01:00"   // no acepta otras zonas horarias que no sean Z
 *   "2025-13-40T99:99:99Z"        // aunque formato válido, valores no reales, pero pasa la regex
 */
  iso8601: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/

}