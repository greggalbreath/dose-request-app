import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as D3 from 'd3';
import { Path, Selection } from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import * as moment from 'moment';

import { TimeCoordinates } from './time-coordinates';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public appointmentListVisible = false;
    public selectedAppointment: any = {};

    public toggleAppointmentList() {
        this.appointmentListVisible = !this.appointmentListVisible;
    }
    public transcriptClicked(): void {
        alert('TODO - show entire transcript');
    }
    public chatClicked(): void {
        alert('TODO - show chat window');
    }
    public delayClicked(): void {
        alert('TODO - DELAY DOSE');
    }
    public stopClicked(): void {
        alert('TODO - STOP DOSE');
    }
    public cancelClicked(): void {
        alert('TODO - CANCEL DOSE');
    }
    public menuButtonClicked(): void {
        alert('TODO - I don\'t know what this button is supposed to do.');
    }
    public appointmentSelected(event): void {
        this.selectedAppointment = event;
    }

}
