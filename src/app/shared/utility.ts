import * as moment from 'moment';

export class Utility {
    public static readonly SEC_TO_MS = 1000;
    public static fixData(obj: any): any {
        let fixed: any = obj;
        for (let i in obj) {
            if (obj[i] !== null && typeof (obj[i]) === "object") fixed[i] = this.fixData(obj[i]);
            else if (obj[i] !== null && typeof (obj[i]) === "string") {
                if (!isNaN(obj[i])) fixed[i] = new Number(obj[i]);
                else if (obj[i] === "true") fixed[i] = true;
                else if (obj[i] === "false") fixed[i] = false;
                else if (moment(obj[i], moment.ISO_8601, true).isValid()) fixed[i] = new Date(obj[i]);
            }
        }
        return fixed;
    }
    public static getDiffSeconds(date1: Date, date2: Date): number {
        if (!date1 || !date2) {
            return -1;
        }
        return (date2.getTime() - date1.getTime()) / Utility.SEC_TO_MS;
    }
    /**
     * 
     * push back a second date by the provided number of seconds if the gap between the 
     * two events is less than the provided duration
     * 
     * @static
     * @param {Date} date1 
     * @param {Date} date2 date which will be moved
     * @param {number} durationSec 
     * @returns {Date} 
     * 
     * @memberOf Utility
     */
    public static padDurationSeconds(date1: Date, date2: Date, durationSec: number): Date {
        if (!date1) {
            return null;
        }
        if (date2) {
            if (Utility.getDiffSeconds(date1, date2) < durationSec) {
                return Utility.dateAddSeconds(date1, durationSec);
            }
        } else {
            return Utility.dateAddSeconds(date1, durationSec);
        }
        //nothing to change
        return date2;
    }
    public static dateAddSeconds(date: Date, durationSec): Date {
        return new Date(date.getTime() + (durationSec * Utility.SEC_TO_MS));
    }
}
