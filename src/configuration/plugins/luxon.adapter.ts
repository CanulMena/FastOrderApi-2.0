import { DateTime } from 'luxon';

export const luxonAdapter = {

  getCurrentDateTimeInYucatan: (zone: string = 'America/Merida'): DateTime => {
    return DateTime.now().setZone(zone);
  },

  getStartOfDay: (dt: DateTime): DateTime => {
    return dt.startOf('day');
  },

  getEndOfDay: (dt: DateTime): DateTime => {
    return dt.endOf('day');
  },

  getDayName: (dt: DateTime): 'DOMINGO' | 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' => {
    const diasEnum = [
      'DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
    ] as const;

    // Luxon: weekday 1 = Monday, 7 = Sunday, así que ajustamos con módulo
    return diasEnum[dt.weekday % 7];
  },

  toJSDate: (dt: DateTime): Date => {
    return dt.toJSDate();
  },

  formatDateTime: (dt: DateTime, format = 'ff'): string => {
    return dt.toFormat(format); // ejemplo de formato: 'yyyy-MM-dd HH:mm:ss'
  }

}