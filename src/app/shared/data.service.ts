import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { Utility } from './utility';
import { Appointment } from './models/appointment';
import { Dose } from './models/dose';
@Injectable()
export class DataService {

  private readonly MIN_TO_MS = 60000;
  private readonly SEC_TO_MS = 1000;
  private SEC_BEFORE_FIRST_SCAN = 120;
  private SEC_BETWEEN_SCANS = 480;
  private SEC_AFTER_LAST_SCAN = 60;
  private SEC_BETWEEN_APPTS = 120;
  private SEC_SCAN_DELAY_DURATION = 300; //amount of time to delay a scan when user requests a "delay"

  public activeAppointmentData: Subject<Array<Appointment>> = new Subject();

  constructor() {
    //DEMO only to hard code time in the future
    var nowMinutes = (new Date()).getTime() / this.MIN_TO_MS;
    this.allAppointmentData[2].startTime = new Date((nowMinutes + 20) * this.MIN_TO_MS);
    this.allAppointmentData[3].startTime = new Date((nowMinutes + 50) * this.MIN_TO_MS);
    this.allAppointmentData[4].startTime = new Date((nowMinutes + 80) * this.MIN_TO_MS);
    this.allAppointmentData[2].doses[0].requestedInjectionTime = new Date((nowMinutes + 25) * this.MIN_TO_MS);
    this.allAppointmentData[2].doses[1].requestedInjectionTime = new Date((nowMinutes + 37) * this.MIN_TO_MS);
    this.allAppointmentData[3].doses[0].requestedInjectionTime = new Date((nowMinutes + 55) * this.MIN_TO_MS);
    this.allAppointmentData[3].doses[1].requestedInjectionTime = new Date((nowMinutes + 67) * this.MIN_TO_MS);
    this.allAppointmentData[4].doses[0].requestedInjectionTime = new Date((nowMinutes + 85) * this.MIN_TO_MS);
    this.allAppointmentData[4].doses[1].requestedInjectionTime = new Date((nowMinutes + 97) * this.MIN_TO_MS);

    this.allAppointmentData[0].status = 'Complete';
    this.allAppointmentData[1].status = 'Complete';
  }
  public queryData(): void {
    this.activeAppointmentData.next(this.getActiveAppointments());

  }

  public allAppointmentData: Array<Appointment> = [
    new Appointment(
      '1234',
      'Ernie Aguilar',
      new Date('2017/06/27 09:40'),
      30,
      'Standard'),
    new Appointment(
      '2345',
      'Peter Parker',
      new Date('2017/06/27 10:20'),
      30,
      'Exercise Stress'),
    new Appointment(
      '3456',
      'Natasha Romanoff',
      new Date('2017/06/27 13:15'),
      28,
      'Exercise Stress',
      [
        new Dose(
          '3456-1',
          '3456',
          'SCAN 1',
          'Rest',
          10,
          new Date('2017/06/27 17:20')
        ),
        new Dose(
          '3456-2',
          '3456',
          'SCAN 2',
          'Stress',
          20,
          new Date('2017/06/27 17:35')
        )
      ]),
    new Appointment(
      '4567',
      'Oswald Cobblepot',
      new Date('2017/06/27 14:00'),
      28,
      'High BMI',
      [
        new Dose(
          '4567-1',
          '3456',
          'SCAN 1',
          'Rest',
          10,
          new Date('2017/06/27 17:20')
        ),
        new Dose(
          '4567-2',
          '3456',
          'SCAN 2',
          'Stress',
          25,
          new Date('2017/06/27 17:35')
        )
      ]),
    new Appointment(
      '5678',
      'Tony Stark',
      new Date('2017/06/27 14:00'),
      28,
      'Exercise Stress',
      [
        new Dose(
          '5678-1',
          '3456',
          'SCAN 1',
          'Rest',
          15,
          new Date('2017/06/27 17:20')
        ),
        new Dose(
          '5678-2',
          '3456',
          'SCAN 2',
          'Stress',
          20,
          new Date('2017/06/27 17:35')
        )
      ]),
  ]
  public getEntireTranscript(): Array<any> {
    return [
      { time: new Date('2017/06/27 09:50:55'), message: 'Doses requested', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 09:51:12'), message: 'Rest dose in production', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 09:56:32'), message: 'Delay +3 minutes requested', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:07:00'), message: 'Synthesis Complete', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:11:50'), message: 'Rest dose dispatched', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:20:12'), message: 'Stress dose in production', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:26:00'), message: 'Synthesis Complete', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:29:35'), message: 'Stress dose dispatched', name: 'Ernie Aguilar' },
      { time: new Date('2017/06/27 10:35:55'), message: 'Doses requested', name: 'Peter Parker' },
      { time: new Date('2017/06/27 10:36:12'), message: 'Rest dose in production', name: 'Peter Parker' },
      { time: new Date('2017/06/27 11:42:00'), message: 'Synthesis Complete', name: 'Peter Parker' },
      { time: new Date('2017/06/27 11:44:50'), message: 'Rest dose dispatched', name: 'Peter Parker' },
    ];
  }

  public getTranscript(_id: string): any {
    if (_id === '1234') {
      return [
        { time: new Date('2017/06/27 09:50:55'), message: 'Doses requested' },
        { time: new Date('2017/06/27 09:51:12'), message: 'Rest dose in production' },
        { time: new Date('2017/06/27 09:56:32'), message: 'Delay +3 minutes requested' },
        { time: new Date('2017/06/27 10:07:00'), message: 'Synthesis Complete' },
        { time: new Date('2017/06/27 10:11:50'), message: 'Rest dose dispatched' },
        { time: new Date('2017/06/27 10:20:12'), message: 'Stress dose in production' },
        { time: new Date('2017/06/27 10:26:00'), message: 'Synthesis Complete' },
        { time: new Date('2017/06/27 10:29:35'), message: 'Stress dose dispatched' },
      ];
    } else if (_id === '2345') {
      return [
        { time: new Date('2017/06/27 10:35:55'), message: 'Doses requested' },
        { time: new Date('2017/06/27 10:36:12'), message: 'Rest dose in production' },
        { time: new Date('2017/06/27 11:42:00'), message: 'Synthesis Complete' },
        { time: new Date('2017/06/27 11:44:50'), message: 'Rest dose dispatched' },
      ];
    }
    return [];
  }

  public getActiveAppointments(): Array<Appointment> {
    return this.allAppointmentData.filter(item => (item.status === 'Active' || item.status === 'Requested'));
  }

  public getActiveDoses(): Array<Dose> {
    let appointments: Array<Appointment> = this.allAppointmentData.filter(item => (item.status === 'Active' || item.status === 'Requested'));
    let doses: Array<Dose> = [];
    if (appointments) {
      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].doses) {
          for (var j = 0; j < appointments[i].doses.length; j++) {
            doses.push(appointments[i].doses[j]);
          }
        }
      }
    }
    return doses;
  }

  public delaySelectedScan(selectedScan: Dose): void {
    console.log(selectedScan);
    selectedScan.requestedInjectionTime = new Date(selectedScan.getDisplayedStartTime().getTime() + (this.SEC_SCAN_DELAY_DURATION * this.SEC_TO_MS));
    this.fixScanSpacing();
    this.activeAppointmentData.next(this.getActiveAppointments());
  }

  public getAppointmentFromScan(doseId: string): Appointment {
    let appointments: Array<Appointment> = this.allAppointmentData;
    let returnAppt: any = {};
    if (appointments) {
      for (let i = 0; i < appointments.length && !returnAppt._id; i++) {
        if (appointments[i].doses) {
          for (var j = 0; j < appointments[i].doses.length && !returnAppt._id; j++) {
            if (appointments[i].doses[j]._id === doseId) {
              returnAppt = appointments[i];
            }
          }
        }
      }
    }
    return returnAppt;
  }

  public updateStatus(apptId: string, newStatus: string): void {
    let apptData = this.allAppointmentData.find(item => (item._id === apptId));
    if (apptData.status !== newStatus) {
      apptData.status = newStatus;
      this.fixScanSpacing();
      this.activeAppointmentData.next(this.getActiveAppointments());
    }
  }

  private fixScanSpacing(): void {
    let activeAppts: Array<Appointment> = this.getActiveAppointments();
    for (let i = 0; i < activeAppts.length; i++) {
      let appt = activeAppts[i];

      if (i > 0) {
        let previousAppt = activeAppts[i - 1];
        let previousAppointmentEnd = Utility.dateAddSeconds(previousAppt.startTime, previousAppt.length * 60);
        appt.startTime = Utility.padDurationSeconds(previousAppointmentEnd, appt.startTime, this.SEC_BETWEEN_APPTS);
      }

      if (appt.doses && appt.doses.length > 0) {
        appt.doses[0].requestedInjectionTime = Utility.padDurationSeconds(appt.startTime, appt.doses[0].getDisplayedStartTime(), this.SEC_BEFORE_FIRST_SCAN);

        for (let j = 1; j < appt.doses.length; j++) { //start at second scan
          let previousScanEnd = Utility.dateAddSeconds(appt.doses[j - 1].getDisplayedStartTime(), appt.doses[j - 1].scanLength * 60);
          appt.doses[j].requestedInjectionTime = Utility.padDurationSeconds(previousScanEnd, appt.doses[j].getDisplayedStartTime(), this.SEC_BETWEEN_SCANS);
        }

        let lastScanEnd = Utility.dateAddSeconds(appt.doses[appt.doses.length - 1].getDisplayedStartTime(), appt.doses[appt.doses.length - 1].scanLength * 60);
        let apptShouldEnd = Utility.dateAddSeconds(lastScanEnd, this.SEC_AFTER_LAST_SCAN);
        let apptEnd = Utility.dateAddSeconds(appt.startTime, appt.length * 60);
        if (apptShouldEnd.getTime() > apptEnd.getTime()) {
          appt.length = Utility.getDiffSeconds(appt.startTime, apptShouldEnd) / 60;
        }
      }
    }
  }
}


