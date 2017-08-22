import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { ChatService } from '../shared/chat.service';
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

  constructor(private chatService: ChatService) { }

  @ViewChild('newMessageText') newMessageText: ElementRef;
  public chatData: Array<any>;
  @Input('status') listStatus: string;
  @Output() closed = new EventEmitter();

  ngOnInit() {
    this.chatService.demoChatData
      .subscribe((data: Array<any>) => {
        this.chatData = data;
      });
    this.chatService.queryData();
  }
  public closeList() {
    this.closed.emit();
  }
  public sendMessage() {
    this.chatService.sendMessage(this.newMessageText.nativeElement.value);
    this.newMessageText.nativeElement.value = '';
  }
  public textAreaKeyPress(key: string): void {
    if (key === 'Enter') {
      this.sendMessage();
    }
  }
}
