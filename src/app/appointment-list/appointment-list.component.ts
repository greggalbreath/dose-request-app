import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { fadeInOut } from '../shared/animations/animations';

import { DataService } from '../shared/data.service';

@Component({
    selector: 'app-appointment-list',
    templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.css'],
    animations: [ fadeInOut ]
})
export class AppointmentListComponent implements OnInit {

  constructor(private dataService: DataService) { }

  public allAppointmentData: Array<any>
  public transcriptData: Array<any>
  @Input('status') listStatus: string;
  @Output() closed = new EventEmitter();

  ngOnInit() {
    this.allAppointmentData = this.dataService.allAppointmentData;
  }
  public closeClicked() {
    console.log(this.closed);
    this.closed.emit();
  }
  public onMouseChange(item: any, enter: boolean) {
      if (enter) {
          item.showStatus = "active";
      } else {
          item.showStatus = "inactive";
      }
      console.log(enter);
      console.log(item);
  }
  public requestDose(item: any): void {
    alert('TODO - Request Dose for ' + item.name);
  }
  public transcriptButtonClicked(clickedItem: any): void {
    if (clickedItem.transcriptVisible == "inactive" || clickedItem.transcriptVisible == undefined) {
      clickedItem.transcriptVisible = "active";
    } else {
      clickedItem.transcriptVisible = "inactive";
    }
    
    this.transcriptData = this.dataService.getTranscript(clickedItem._id);
  }

}
