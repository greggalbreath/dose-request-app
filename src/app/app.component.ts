import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as D3 from 'd3';
import { Path, Selection } from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import * as moment from 'moment';

import { TimeCoordinates } from './time-coordinates';
import { DataService } from './shared/data.service';
import { Dose } from './shared/models/dose';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private dataService: DataService) { }

    public selectedScan: any = {};
    public selectedAppt: any = {};
    public delayButtonState: string = 'NONE';

    public transcriptClicked(): void {
        alert('TODO - show entire transcript');
    }
    public chatClicked(): void {
        alert('TODO - show chat window');
    }
    public delayClicked(): void {
        if (this.delayButtonState === 'DELAY') {
            this.dataService.delaySelectedScan(this.selectedScan);
        } else if (this.delayButtonState === 'REDO') {
            alert('TODO - REDO DOSE');
        }
    }

    public cancelClicked(): void {
        alert('TODO - CANCEL DOSE');
    }
    public menuButtonClicked(): void {
        alert('TODO - I don\'t know what this button is supposed to do.');
    }
    public scanSelected(event: Dose): void {
        if (event) {
            // console.log(event);
            if (event._id) {
                this.selectedAppt = this.dataService.getAppointmentFromScan(event._id);
                this.selectedScan = event;
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
            this.selectedScan = null;
            this.delayButtonState = 'NONE';
        }
        console.log(this.delayButtonState);
    }
}
