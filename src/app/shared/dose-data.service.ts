import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import * as mqtt from 'mqtt';
import { UUID } from 'angular2-uuid';
import { Utility } from './utility';
import { Appointment } from './models/appointment';
import { Dose } from './models/dose';
@Injectable()
export class DoseDataService {

  private client;
  private readonly OUTGOING_TOPIC = 'vervet-command';
  private readonly INCOMING_TOPIC = 'vervet-state';
  private readonly MACAQUE_SERVER = 'localhost';
  private readonly MACAQUE_PORT = 8080;

  public updatedDoses: Subject<any> = new Subject();

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
    let incomingItem: any = Utility.fixData(JSON.parse(message.toString()));
    switch (incomingItem.name) {
      case 'update':
        this.updatedDoses.next(incomingItem);
        break;
      case 'response':
      default:
        //TODO handle other messages

        break;
    }
  }

  public requestDoses(appointmentData: Appointment): void {

    if (appointmentData.doses) {
      for (let i = 0; i < appointmentData.doses.length; i++) {
        let newMessage = {
          name: "new",
          payload: appointmentData.doses[i].getMacaquePayload()
        };
        this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
      }
    }
  }

}
