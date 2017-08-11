import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import * as mqtt from 'mqtt';
import { UUID } from 'angular2-uuid';
import { Utility } from './utility';

@Injectable()
export class MacaqueService {

  private client;
  private readonly OUTGOING_TOPIC = 'vervet-command';
  private readonly INCOMING_TOPIC = 'vervet-state';
  private readonly MACAQUE_SERVER = 'localhost';
  private readonly MACAQUE_PORT = 8080;

  public displayedDoses: Subject<Array<any>> = new Subject();
  private doseData: Array<any> = [];

  constructor() {
    if (!this.client) {
      this.client = mqtt.connect({ host: this.MACAQUE_SERVER, port: this.MACAQUE_PORT });
      this.client.on('connect', () => this.subscribe());
      this.client.on('message', (topic, message) => this.parseMessage(topic, message));
    }
  }

  private subscribe(): void {
    this.client.subscribe(this.INCOMING_TOPIC);
  }

  private parseMessage(topic, message): void {
    console.log(Utility.fixData(JSON.parse(message.toString())));
    let incomingItem: any = Utility.fixData(JSON.parse(message.toString()));
    switch (incomingItem.name) {
      case 'update':


        let doseItem = this.doseData.find(item => (item._dose === incomingItem._dose));
        if (doseItem) {

        } else {
          this.doseData.push(incomingItem);
          this.displayedDoses.next(this.doseData);
        }
        break;
      case 'response':
      default:
        //TODO handle other messages

        break;
    }
  }

  public requestDoses(appointmentData: any): void {

    if (appointmentData.scans) {
      for (let i = 0; i < appointmentData.scans.length; i++) {

        let newMessage = {
          name: "new",
          payload: {
            _request: UUID.UUID(),	        // unique ID of the request
            deviceID: 'c-app',	    // code that issues the request
            userID: 'ggalbreath',		    // user who submits the dose request
            productID: 'ammonia',	    // product (ammonia, FDG)
            clinicID: 'mainClinic',	    // clinic that submits the dose request
            _appointment: appointmentData._id,	    // unique ID of the appointment
            _dose: appointmentData.scans[i]._id,			// unique ID of the dose
            activity: appointmentData.scans[i].activity,		// injection activity [mCi]
            injectionTime: appointmentData.scans[i].startTime
          }
        }
        this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
      }
    }
  }

}
