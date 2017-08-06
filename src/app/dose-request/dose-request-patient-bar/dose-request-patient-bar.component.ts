import { Component, OnInit, Input } from '@angular/core';

import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-dose-request-patient-bar',
  templateUrl: './dose-request-patient-bar.component.html',
  styleUrls: ['./dose-request-patient-bar.component.css']
})
export class DoseRequestPatientBarComponent {

  constructor(private dataService: DataService) { }

  @Input() public data: any = {};

  ngOnInit() {
  }

}
