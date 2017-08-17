import { Dose } from './dose';

export class Appointment {

    public _id: string;
    public name: string;
    public startTime: Date;
    public length: number;            //appointment length minutes
    public protocol: string = 'Standard';
    public status: string = 'Scheduled';
    public doses: Array<Dose>;

    //default flags for UI
    public showStatus: string = 'inactive';
    public transcriptVisible: boolean = false;

    constructor(_id: string, name: string, startTime: Date, length: number, protocol?: string, doses?: Array<Dose>) {
        this._id = _id;
        this.name = name;
        this.startTime = startTime;
        this.length = length;
        if (protocol) this.protocol = protocol;
        if (doses) this.doses = doses;
    }

}