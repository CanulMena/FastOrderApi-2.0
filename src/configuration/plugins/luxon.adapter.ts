import { DateTime } from 'luxon';
import { CustomError } from '../../domain/errors';
import { WeekDays } from '../../domain/entities';

export const luxonAdapter = {
  getCurrentDateTimeInZone: (zone: string = 'America/Merida'): DateTime => 
    DateTime.now().setZone(zone),

  getStartOfDayUtc: (zone: string): DateTime => 
    DateTime.now().setZone(zone).startOf('day').toUTC(),

  getEndOfDayUtc: (zone: string): DateTime => 
    DateTime.now().setZone(zone).endOf('day').toUTC(),

  getDayName: (dt: DateTime): WeekDays => {
    const diasEnum: WeekDays[] = [
      'DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
    ];
    return diasEnum[dt.weekday % 7];
  },

  toJSDate: (dt: DateTime): Date => dt.toJSDate(),

  /** Nuevo método limpio y único propósito */
  getDayRangeUtcByZone: (zone: string): { startUTC: Date; endUTC: Date; dayName: WeekDays } => {
    const startDT = luxonAdapter.getStartOfDayUtc(zone);
    const endDT = luxonAdapter.getEndOfDayUtc(zone);

    return {
      startUTC: luxonAdapter.toJSDate(startDT),
      endUTC: luxonAdapter.toJSDate(endDT),
      dayName: luxonAdapter.getDayName(startDT)
    };
  }
};
