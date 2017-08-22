import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/observable/timer';

@Injectable()
export class ChatService {

  public demoChatData: Subject<Array<any>> = new Subject();
  constructor() {
  }

  private chatData: Array<any> = [
    {
      text: 'Our morning QA is complete and we are ready to get started.',
      user: 'operator',
      timestamp: new Date('2017/06/27 09:05'),
    },
    {
      text: 'Next patient arrived 5 minutes late.',
      user: 'clinic',
      timestamp: new Date('2017/06/27 09:42'),
    },
    {
      text: 'okay',
      user: 'operator',
      timestamp: new Date('2017/06/27 09:43'),
    },
    {
      text: 'Will it work out if we add a patient late in the afternoon?',
      user: 'clinic',
      timestamp: new Date('2017/06/27 09:50'),
    },
    {
      text: 'That will be fine.',
      user: 'operator',
      timestamp: new Date('2017/06/27 09:52'),
    },
    {
      text: 'We had a problem with the last patient and weren\'t able to use the rest dose before it expired. We will request again.',
      user: 'clinic',
      timestamp: new Date('2017/06/27 10:40'),
    },
  ];
  private nextCannedResponse: number = 0;
  private cannedOperatorResponses: Array<string> = [
    'okay', 'sounds good', 'You\'re right... Greg is cool!'
  ]

  public queryData(): void {
    this.demoChatData.next(this.chatData);
  }

  public sendMessage(message: string): void {
    this.chatData.push({
      text: message,
      user: 'clinic',
      timestamp: new Date()
    });
    this.demoChatData.next(this.chatData);
    let countDown = Observable.timer(5 * 1000)
      .subscribe(() => this.sendOperatorResponse());
  }

  private sendOperatorResponse(): void {
    this.chatData.push({
      text: this.cannedOperatorResponses[this.nextCannedResponse++],
      user: 'operator',
      timestamp: new Date()
    });
    if (this.nextCannedResponse >= this.cannedOperatorResponses.length) {
      this.nextCannedResponse = 0;
    }
    this.demoChatData.next(this.chatData);
  }

}


