import { Injectable } from '@angular/core';

@Injectable()
export class ScanTimeCalculationsService {

  constructor() { }

  //these are in units of seconds
  public static readonly MIN_TIME_BEFORE_SCAN = 90;
  public static readonly MIN_TIME_BETWEEN_SCAN = 600;
  public static readonly MIN_TIME_AFTER_SCAN = 120;
  public static readonly MIN_TIME_BETWEEN_APPOINTMENTS = 120;

  public static readonly DELAY_TIME = 180;

  public delayNextScan(scanData: Array<any>): void {
    scanData[0].startTime = new Date((((new Date()).getTime() / 60000) + 19) * 60000);
  }
}
