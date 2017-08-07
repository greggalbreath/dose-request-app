import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-dose-request-appointment-bar',
  templateUrl: './dose-request-appointment-bar.component.html',
  styleUrls: ['./dose-request-appointment-bar.component.css']
})
export class DoseRequestAppointmentBarComponent {

  constructor(private dataService: DataService) { }

  @Input() public data: any = {};

  ngOnInit() {
  }

}
