import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {

  constructor(private dataService: DataService) { }

  public allAppointmentData: Array<any>
  public transcriptData: Array<any>
  @Output() closed = new EventEmitter();

  ngOnInit() {
    this.allAppointmentData = this.dataService.allAppointmentData;
  }
  public closeClicked() {
    this.closed.emit();
  }
  public onMouseChange(item: any, enter: boolean) {
    if (item.status === 'Scheduled') {
      item.showRequestDose = enter;
    } else {
      item.showRequestDose = false;
    }
    if (item.status === 'Complete') {
      item.showTranscriptButton = enter;
    } else {
      item.showTranscriptButton = false;
    }
  }
  public requestDose(item: any): void {
    alert('TODO - Request Dose for ' + item.name);
  }
  public transcriptButtonClicked(clickedItem: any): void {
    clickedItem.transcriptVisible = !clickedItem.transcriptVisible;
    if (clickedItem.transcriptVisible) {
      //set all other flags to false
      for (let item of this.allAppointmentData) {
        if (item._id !== clickedItem._id) {
          item.transcriptVisible = false;
        }
      }
      this.transcriptData = this.dataService.getTranscript(clickedItem._id);
    }
  }
}
