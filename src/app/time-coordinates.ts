import * as moment from 'moment';

export class TimeCoordinates {
    private widthMinutes = 120;
    private widthPixels = 1400;
    private relativeStartTime = -15;
    private pixelsPerMinute = this.widthPixels / this.widthMinutes;

    constructor() {
    }

    rescale(widthMinutes, widthPixels, relativeStartTime) {
        this.widthMinutes = widthMinutes;
        this.widthPixels = widthPixels;
        this.relativeStartTime = relativeStartTime;
        this.pixelsPerMinute = this.widthPixels / this.widthMinutes;
    }

    public getX(date: Date): number {
        let leftAxisMinute = ((new Date()).getTime() / 60 / 1000) + this.relativeStartTime;
        let requestedMinute = date.getTime() / 60 / 1000;
        return (requestedMinute - leftAxisMinute) * this.pixelsPerMinute;
    }

    public getWidth(minutes: number): number {
        return minutes * this.pixelsPerMinute;
    }

    public minutesAwayToRadius(minutes: number): number {
        if (minutes > 30) {
            return 0;
        }
        return ((30 - minutes) / 30) * Math.PI * 2;
    }

    public minutesLabel(minutes: number): string {
        if (minutes < 0) {
            return '';
        } else if (minutes <= 1) {
            return '< 1m';
        } else if (minutes < 10) {
            return ':0' + Math.floor(minutes) + 'm';
        } else if (minutes < 60) {
            return ':' + Math.floor(minutes) + 'm';
        } else {
            if ((Math.floor(minutes % 60)) < 10) {
                return Math.floor(minutes / 60) + ':0' + Math.floor(minutes % 60);
            }
            return Math.floor(minutes / 60) + ':' + Math.floor(minutes % 60);
        }
    }
}