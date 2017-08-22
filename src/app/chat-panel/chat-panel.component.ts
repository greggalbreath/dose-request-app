import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../shared/data.service';
import { DoseDataService } from '../shared/dose-data.service';
import { Appointment } from '../shared/models/appointment';
import { Dose } from '../shared/models/dose';
import { fadeInOut } from '../shared/animations/animations';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css'],
  animations: [fadeInOut]
})
export class ChatPanelComponent implements OnInit {

  constructor(private dataService: DataService, private doseDataService: DoseDataService) { }

  public chatData: Array<any>;
  @Input('status') listStatus: string;
  @Output() closed = new EventEmitter();

  ngOnInit() {
    this.chatData = this.dataService.demoChatData;

  }
  public closeList() {
    this.closed.emit();
  }
}
