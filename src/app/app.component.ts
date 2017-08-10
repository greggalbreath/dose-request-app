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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private dataService: DataService) { }

    public selectedScan: any = {};

    public transcriptClicked(): void {
        alert('TODO - show entire transcript');
    }
    public chatClicked(): void {
        alert('TODO - show chat window');
    }
    public delayClicked(): void {
        this.dataService.delaySelectedScan(this.selectedScan);
    }
    public redoClicked(): void {
        alert('TODO - REDO DOSE');
    }
    public cancelClicked(): void {
        alert('TODO - CANCEL DOSE');
    }
    public menuButtonClicked(): void {
        alert('TODO - I don\'t know what this button is supposed to do.');
    }
    public scanSelected(event): void {
        console.log(event);
        this.selectedScan = this.dataService.getAppointmentFromScan(event._id);
    }

}
