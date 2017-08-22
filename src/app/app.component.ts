import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as D3 from 'd3';
import { Path, Selection } from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import * as moment from 'moment';

import { TimeCoordinates } from './time-coordinates';
import { DataService } from './shared/data.service';
import { DoseDataService } from './shared/dose-data.service';
import { Appointment } from './shared/models/appointment';
import { Dose } from './shared/models/dose';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private dataService: DataService, private doseDataService: DoseDataService) { }

    public selectedDose: Dose;
    public selectedAppt: Appointment;
    public delayButtonState: string = 'NONE';
    public sideNavState = 'appointment';
    public ngOnInit(): void {
        //for demo only cancel all appointments
        for (let i = 0; i < this.dataService.allAppointmentData.length; i++) {
            let element = this.dataService.allAppointmentData[i];
            if (element.status !== 'Complete') {
                this.doseDataService.sendVervetMessage('cancel', element);
            }
        }
    }

    public transcriptClicked(): void {
        alert('TODO - show entire transcript');
    }
    public chatClicked(): void {
        alert('TODO - show chat window');
    }
    public delayClicked(): void {
        let commandName: string;

        if (this.delayButtonState === 'DELAY') {
            commandName = 'update';
        } else if (this.delayButtonState === 'REDO') {
            commandName = 'redo';
        } else {
            //expected state;
            return;
        }

        this.dataService.delaySelectedScan(this.selectedDose);

        let activeAppts: Array<Appointment> = this.dataService.getActiveAppointments();
        let foundFirst = false;
        for (var i = activeAppts.length - 1; i >= 0; i--) {
            if (foundFirst) {
                //update all subsequent doses as they may have been moved
                this.doseDataService.sendVervetMessage(commandName, activeAppts[i]);
            }

            if (activeAppts[i]._id === this.selectedAppt._id) {
                this.doseDataService.sendVervetMessage(commandName, activeAppts[i], this.selectedDose);
                foundFirst = true;
            }
        }
    }


    public cancelClicked(): void {
        this.doseDataService.sendVervetMessage('cancel', this.selectedAppt, this.selectedDose);
        this.dataService.updateStatus(this.selectedAppt._id, 'Scheduled');
    }

    public menuButtonClicked(): void {
        alert('TODO - I don\'t know what this button is supposed to do.');
    }
    public scanSelected(event: Dose): void {
        if (event) {
            if (event._id) {
                this.selectedAppt = this.dataService.getAppointmentFromScan(event._id);
                this.selectedDose = event;
            }
            if (event.schedule) {
                if (event.schedule.beamOff.getTime() > (new Date()).getTime()) {
                    this.delayButtonState = 'DELAY';
                } else {
                    this.delayButtonState = 'REDO';
                }
            } else {
                this.delayButtonState = 'NONE';
            }
        } else {
            this.selectedAppt = null;
            this.selectedDose = null;
            this.delayButtonState = 'NONE';
        }
    }
}
