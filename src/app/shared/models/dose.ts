import { UUID } from 'angular2-uuid';

export class Dose {

    public _id: string;
    public name: string; //name displayed on UI graphic
    public type: string;
    public activity: number; //dose activity in mCi
    public requestedInjectionTime: Date;
    public scanLength: number = 10; //length in minutes that the scan will be represente on screen
    public userID: string = 'ggalbreath';		    // user who submits the dose request
    public productID: string = 'ammonia';	    // product (ammonia, FDG)
    public clinicID: string = 'mainClinic';	    // clinic that submits the dose request
    public _appointment: string;
    public estimatedInjectionTime: Date; //TODO this needs to be updated by vervet
    public schedule: any; // milestone array returned by vervet

    constructor(_id: string, _appointment: string, name: string, type: string, activity: number, requestedInjectionTime: Date) {
        this._id = _id;
        this._appointment = _appointment;
        this.name = name;
        this.type = type;
        this.activity = activity;
        this.requestedInjectionTime = requestedInjectionTime;
    }

    public getMacaquePayload(): any {
        return {
            _request: UUID.UUID(),	        // unique ID of the request
            deviceID: 'c-app',	    // code that issues the request
            userID: this.userID,		    // user who submits the dose request
            productID: this.productID,	    // product (ammonia, FDG)
            clinicID: this.clinicID,	    // clinic that submits the dose request
            _appointment: this._appointment,
            _dose: this._id,			// unique ID of the dose
            activity: this.activity,		// injection activity [mCi]
            injectionTime: this.requestedInjectionTime
        };
    }
    public getDisplayedStartTime(): Date {
        if (this.estimatedInjectionTime) {
            return this.estimatedInjectionTime;
        }
        return this.requestedInjectionTime;
    }

    //            activity: appointmentData.scans[i].activity,		// injection activity [mCi]
    //            injectionTime: appointmentData.scans[i].startTime
    //            _dose: appointmentData.scans[i]._id,			// unique ID of the dose
    //            deviceID: 'c-app',	    // code that issues the request
    //_request: UUID.UUID(),	        // unique ID of the request
}