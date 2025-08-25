import { CronService } from './cron/cron-service';
// import { LoadingDailyRations } from '../domain/use-cases/dish/loading-daily-rations';
import { PostgresSchedDishDataSourceImpl, PostgresDishDatasourceImpl } from '../infrastructure/datasource';
import { SchedDishRepositoryImpl, DishRepositoryImpl } from '../infrastructure/repository';

export class CronJobs {
  // static executeRationsLoad() {
  //   // Configurar el cron job para cargar raciones diarias
  //   CronService.createCronJob(
  //     // '* * * * *', // Ejecutar cada minuto (para pruebas)
  //     // '0 5 * * *', // Ejecutar todos los días a las 5:00 AM
  //     '49 0 * * *', // Ejecutar todos los días a las 12:40 AM//ejecutar a las 12:40 am. 
  //     async () => {
  //       // console.log('⏰ Ejecutando cron para cargar raciones del día...');
        
  //       // Instanciar dependencias necesarias
  //       const schedDishDatasource = new PostgresSchedDishDataSourceImpl();
  //       const dishDatasource = new PostgresDishDatasourceImpl();
        
  //       const schedDishRepository = new SchedDishRepositoryImpl(schedDishDatasource);
  //       const dishRepository = new DishRepositoryImpl(dishDatasource);

  //       // Ejecutar el caso de uso
  //       await new LoadingDailyRations(schedDishRepository, dishRepository).execute();
  //     }
  //   );
  // }
}