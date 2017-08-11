import * as moment from 'moment';

export class Utility {

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
}
