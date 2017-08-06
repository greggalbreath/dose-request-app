import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  constructor() {
  }

  public updateDemoData() {
    //DEMO only to hard code time in the future
    var nowMinutes = (new Date()).getTime() / 60000;
    this.doseData[0].estimatedDeliveryTime = new Date((nowMinutes + 12) * 60000);
    this.doseData[0].milestones[0].time = new Date((nowMinutes - 8) * 60000);
    this.doseData[0].milestones[1].time = new Date((nowMinutes - 2) * 60000);
    this.doseData[0].milestones[2].time = new Date((nowMinutes + 4) * 60000);
    this.doseData[0].milestones[3].time = new Date((nowMinutes + 8) * 60000);
    this.doseData[1].estimatedDeliveryTime = new Date((nowMinutes + 30) * 60000);
    this.doseData[1].milestones[0].time = new Date((nowMinutes + 20) * 60000);
    this.doseData[1].milestones[1].time = new Date((nowMinutes + 22) * 60000);
    this.doseData[1].milestones[2].time = new Date((nowMinutes + 24) * 60000);
    this.doseData[1].milestones[3].time = new Date((nowMinutes + 26) * 60000);
    this.allAppointmentData[2].startTime = new Date((nowMinutes + 15) * 60000);
    this.allAppointmentData[3].startTime = new Date((nowMinutes + 50) * 60000);
    this.scanData[0].startTime = new Date((nowMinutes + 17) * 60000);
    this.scanData[1].startTime = new Date((nowMinutes + 33) * 60000);
    this.scanData[2].startTime = new Date((nowMinutes + 52) * 60000);
    this.scanData[3].startTime = new Date((nowMinutes + 67) * 60000);
  }
  public doseData: Array<any> = [
    {
      estimatedDeliveryTime: new Date('2017/06/27 17:18'),
      doseWindowMinutes: 7,
      milestones: [{
        description: 'beam on',
        time: new Date('2017/06/27 17:32')
      }, {
        description: 'beam off',
        time: new Date('2017/06/27 17:35')
      }, {
        description: 'synthesis complete',
        time: new Date('2017/06/27 17:40')
      }, {
        description: 'QC complete',
        time: new Date('2017/06/27 17:45')
      }
      ]
    },
    {
      estimatedDeliveryTime: new Date('2017/06/27 17:32'),
      doseWindowMinutes: 7,
      milestones: [{
        description: 'beam on',
        time: new Date('2017/06/27 17:32')
      }, {
        description: 'beam off',
        time: new Date('2017/06/27 17:35')
      }, {
        description: 'synthesis complete',
        time: new Date('2017/06/27 17:40')
      }, {
        description: 'QC complete',
        time: new Date('2017/06/27 17:45')
      }
      ]
    }
  ];

  public scanData: Array<any> = [
    {
      _patientid: '12345',
      name: 'SCAN 1',
      type: 'Rest',
      dose: '10 mCi',
      startTime: new Date('2017/06/27 17:20'),
      length: 8
    },
    {
      _patientid: '12345',
      name: 'SCAN 2',
      type: 'Stress',
      dose: '20 mCi',
      startTime: new Date('2017/06/27 17:35'),
      length: 7
    },
    {
      _patientid: '34567',
      name: 'SCAN 1',
      type: 'Rest',
      dose: '10 mCi',
      startTime: new Date('2017/06/27 18:20'),
      length: 10
    },
    {
      _patientid: '34567',
      name: 'SCAN 2',
      type: 'Stress',
      dose: '20 mCi',
      startTime: new Date('2017/06/27 18:35'),
      length: 6
    }
  ]

  public allAppointmentData: Array<any> = [
    {
      _id: '1234',
      name: 'Ernie Aguilar',
      startTime: new Date('2017/06/27 09:40'),
      protocol: 'Standard',
      status: 'Complete',
      length: 30
    },
    {
      _id: '2345',
      name: 'Peter Parker',
      startTime: new Date('2017/06/27 10:20'),
      protocol: 'Exercise Stress',
      status: 'Complete',
      length: 30
    },
    {
      _id: '3456',
      name: 'Natasha Romanoff',
      startTime: new Date('2017/06/27 13:15'),
      protocol: 'Exercise Stress',
      status: 'Active',
      length: 30
    },
    {
      _id: '4567',
      name: 'Oswald Cobblepot',
      startTime: new Date('2017/06/27 14:00'),
      protocol: 'High BMI',
      status: 'Requested',
      length: 30
    },
    {
      _id: '5678',
      name: 'Tony Stark',
      startTime: new Date('2017/06/27 14:20'),
      protocol: 'Exercise Stress',
      status: 'Scheduled',
      length: 30
    },
  ]
  public getTranscript(_id: string): any {
    if (_id === '1234') {
      return [
        { time: new Date('2017/06/27 09:50:55'), message: 'Dose request sent' },
        { time: new Date('2017/06/27 09:51:08'), message: 'Request acknowledged' },
        { time: new Date('2017/06/27 09:51:12'), message: 'Rest dose in production' },
        { time: new Date('2017/06/27 09:51:14'), message: 'Rest dose ETA 10:11 AM' },
        { time: new Date('2017/06/27 09:51:15'), message: 'Stress dose ETA 10:31 AM' },
        { time: new Date('2017/06/27 09:54:00'), message: 'Beam On' },
        { time: new Date('2017/06/27 09:56:32'), message: 'Delay +3 minutes requested' },
        { time: new Date('2017/06/27 09:56:40'), message: 'Rest dose ETA 10:14 AM' },
        { time: new Date('2017/06/27 09:56:41'), message: 'Stress dose ETA 10:34 AM' },
        { time: new Date('2017/06/27 10:05:00'), message: 'Beam Off' },
        { time: new Date('2017/06/27 10:07:00'), message: 'Synthesis Complete' },
        { time: new Date('2017/06/27 10:07:35'), message: 'Rest dose assay 34 mCi' },
        { time: new Date('2017/06/27 10:11:15'), message: 'QC complete' },
        { time: new Date('2017/06/27 10:11:50'), message: 'Rest dose dispatched' },
        { time: new Date('2017/06/27 10:11:51'), message: 'Rest dose ETA 10:14:20 AM' }
      ];
    } else if (_id === '2345') {
      return [
        { time: new Date('2017/06/27 10:25:55'), message: 'Dose request sent' },
        { time: new Date('2017/06/27 10:26:08'), message: 'Request acknowledged' },
        { time: new Date('2017/06/27 10:26:12'), message: 'Rest dose in production' },
        { time: new Date('2017/06/27 10:26:14'), message: 'Rest dose ETA 11:47 AM' },
        { time: new Date('2017/06/27 10:26:15'), message: 'Stress dose ETA 12:02 PM' },
        { time: new Date('2017/06/27 10:29:00'), message: 'Beam On' },
        { time: new Date('2017/06/27 10:31:32'), message: 'Delay +3 minutes requested' },
        { time: new Date('2017/06/27 10:31:40'), message: 'Rest dose ETA 11:50 AM' },
        { time: new Date('2017/06/27 10:31:41'), message: 'Stress dose ETA 12:05 PM' },
        { time: new Date('2017/06/27 11:40:00'), message: 'Beam Off' },
        { time: new Date('2017/06/27 11:42:00'), message: 'Synthesis Complete' },
        { time: new Date('2017/06/27 11:42:35'), message: 'Rest dose assay 34 mCi' },
        { time: new Date('2017/06/27 11:47:15'), message: 'QC complete' },
        { time: new Date('2017/06/27 11:47:50'), message: 'Rest dose dispatched' },
        { time: new Date('2017/06/27 11:47:51'), message: 'Rest dose ETA 11:51:20 AM' }
      ];
    }
    return [];
  }
  public getActiveAppointment(): Array<any> {
    return this.allAppointmentData.filter(this.isActiveAppointent);
  }
  private isActiveAppointent(item: any): boolean {
    return (item.status === 'Active' || item.status === 'Requested');
  }
}


