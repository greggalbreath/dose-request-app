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

  private readonly MIN_TO_MS = 60000;
  private readonly SEC_TO_MS = 1000;
  private SEC_SCAN_DELAY_DURATION = 300; //amount of time to delay a scan when user requests a "delay"


  public updatedDoses: Subject<any> = new Subject();
  private doseQueue: Array<Dose>;

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

        let foundDose = this.doseQueue.find(item => (item._id === incomingItem._dose));
        foundDose.schedule = incomingItem.schedule;

        this.updatedDoses.next(this.doseQueue);
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
  private sendVervetMessage(commandName: string, appointmentData: Appointment, startWithDose?: Dose): void {
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
  public demoOnlySendCancel(appointmentData: Appointment): void {
    if (appointmentData.doses) {
      for (let i = 0; i < appointmentData.doses.length; i++) {
        let newMessage = {
          name: 'cancel',
          payload: appointmentData.doses[i].getMacaquePayload()
        };
        this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
      }
    }
  }

  public requestDoses(appointmentData: Appointment): void {
    for (let i = 0; i < appointmentData.doses.length; i++) {
      let foundDose = this.doseQueue.find(item => (item._id === appointmentData[i]._dose));
      if (!foundDose) {
        //dose is not in queue
        this.doseQueue.push(appointmentData.doses[i]);
      }
    }
    this.sendVervetMessagesFromQueue();
  }

  public cancelDoses(appointmentData: Appointment): void {
    for (let i = 0; i < this.doseQueue.length; i++) {
      if (this.doseQueue[i]._appointment === appointmentData._id) {
        this.doseQueue[i].status = 'cancel';
      }
    }
    this.sendVervetMessagesFromQueue();
  }

  public delayDose(selectedScan: Dose): void {

    let foundDose = this.doseQueue.find(item => (item._id === selectedScan._id));
    if (foundDose) {
      foundDose.requestedInjectionTime = new Date(foundDose.getDisplayedStartTime().getTime() + (this.SEC_SCAN_DELAY_DURATION * this.SEC_TO_MS));
      foundDose.status = 'modify';
      this.sendVervetMessagesFromQueue();
      //TODO fixScanSpacing();
      //TODO update subsequent doses
    }
  }

  private sendVervetMessagesFromQueue(): void {
    if (this.doseQueue) {
      for (let i = this.doseQueue.length - 1; i < 1; i++) {
        //cancel all doses other than first
        let newMessage = {
          name: 'cancel',
          payload: this.doseQueue[i].getMacaquePayload()
        };
        this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
      }

      if (this.doseQueue.length > 0) {
        let command = 'new';
        switch (this.doseQueue[0].status) {
          case 'none':
            command = 'new';
            break;
          case 'modify':
            if (this.doseQueue[0].schedule.beamOff.getTime() > (new Date()).getTime()) {
              command = 'update';
            } else {
              command = 'redo';
            }
            break;
          case 'cancel':
            command = 'cancel';
            break;
        }
        let newMessage = {
          name: command,
          payload: this.doseQueue[0].getMacaquePayload()
        };
        this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
        if (command !== 'cancel') {
          this.doseQueue[0].status = 'requested';
        }
      }
      for (let i = 1; i < this.doseQueue.length; i++) {
        if (this.doseQueue[0].status !== 'cancel') {
          //send a 'new' for doses other than first or cancelled
          let newMessage = {
            name: 'new',
            payload: this.doseQueue[i].getMacaquePayload()
          };
          this.client.publish(this.OUTGOING_TOPIC, JSON.stringify(newMessage));
          this.doseQueue[i].status = 'requested';
        }
      }
      //remove 'cancel' from queue
      this.doseQueue = this.doseQueue.filter(item => (item.status !== 'cancel'));
      this.updatedDoses.next(this.doseQueue);
    }
  }
}
