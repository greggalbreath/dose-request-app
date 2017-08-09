import { Component, OnInit } from '@angular/core';

import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-dose-request-patient-bar',
  templateUrl: './dose-request-patient-bar.component.html',
  styleUrls: ['./dose-request-patient-bar.component.css']
})
export class DoseRequestPatientBarComponent implements OnInit {

  constructor(private dataService: DataService) { }


  public appointmentData: any = {};

  ngOnInit() {
    if (this.dataService.appointmentData.length > 0) {
      this.appointmentData = this.dataService.appointmentData[0];
    } else {
      this.appointmentData = {};
    }

  }

}
