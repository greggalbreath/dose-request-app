import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../shared/data.service';
import { DoseDataService } from '../shared/dose-data.service';
import { Appointment } from '../shared/models/appointment';
import { Dose } from '../shared/models/dose';
import { fadeInOut } from '../shared/animations/animations';

@Component({
  selector: 'app-transcript-panel',
  templateUrl: './transcript-panel.component.html',
  styleUrls: ['./transcript-panel.component.css'],
  animations: [fadeInOut]
})
export class TranscriptPanelComponent implements OnInit {

  constructor(private dataService: DataService, private doseDataService: DoseDataService) { }

  public transcriptData: Array<any>;
  @Input('status') listStatus: string;
  @Output() closed = new EventEmitter();

  ngOnInit() {
    this.transcriptData = this.dataService.getEntireTranscript();

  }
  public closeList() {
    this.closed.emit();
  }
}
