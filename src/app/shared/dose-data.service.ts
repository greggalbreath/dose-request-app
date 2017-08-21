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
        //TODO handle other messages from vervet

        break;
    }
  }

  /**
   * Send update command to vervet for doses in appointment
   * 
   * @param {Appointment} appointmentData object that includes the doses array
   * @param {Dose} [startWithDose] if this is provided, then don't send an update for all doses, but start with this provided dose
   * 
   * @memberOf DoseDataService
   */
  public sendVervetMessage(commandName: string, appointmentData: Appointment, startWithDose?: Dose): void {
    if (appointmentData.doses) {
      let updateAllDoses: boolean = (!startWithDose);
      for (let i = appointmentData.doses.length - 1; i >= 0; i--) {
        if (!updateAllDoses) {
          updateAllDoses = (startWithDose._id === appointmentData.doses[i]._id);
        }
        if (updateAllDoses) {
          let newMessage = {
            name: commandName,
            payload: appointmentData.doses[i].getMacaquePayload()
          };
          this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
        }
      }
    }
  }
}
