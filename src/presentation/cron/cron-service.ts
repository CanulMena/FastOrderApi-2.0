import { CronJob } from 'cron';

type CronTime = string | Date;

type onTick = () => void;

export class CronService {

    static createCronJob(
        CronTime: CronTime,
        ontick: onTick
    ) : CronJob {

        const job = CronJob.from({
            cronTime: CronTime,
            onTick: ontick,
            start: true,
            timeZone: 'America/Merida'
        });        

        return job; 
    }

}