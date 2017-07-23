import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as D3 from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import * as moment from 'moment';

import { TimeCoordinates } from './time-coordinates';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

    @ViewChild('container') element: ElementRef;
    //private htmlElement: HTMLElement;
    private host;
    private svg;

    private timeCoordinates = new TimeCoordinates();
    //component sizing
    private circleRadius = 40;
    private pointerBoxHeight = 70;
    private pointerBoxWidth = 140;

    //window configuration
    private canvasWidth = 1400;
    private canvasHeight = 600;
    private canvasWidthMinutes = 90;
    private relativeStartMinutes = -15;

    private configData: Array<any> = [{
        arcColor: '#00afff',
        color: '#3176af',
        y: 150
    },
    {
        arcColor: '#7e7cee',
        color: '#5f5fae',
        y: 400
    }];

    private appointmentConfig = {
        color: '#1bdbae',
        y: 250
    }

    private doseData: Array<any> = [
        {
            estimatedDeliveryTime: new Date('2017/06/27 17:18'),
            doseWindowMinutes: 7,
            milestones: [{
                description: 'beam on',
                time: new Date('2017/06/27 17:32')
            }, {
                description: 'beam off',
                time: new Date('2017/06/27 17:35')
            }, {
                description: 'synthesis complete',
                time: new Date('2017/06/27 17:40')
            }, {
                description: 'QC complete',
                time: new Date('2017/06/27 17:45')
            }
            ]
        },
        {
            estimatedDeliveryTime: new Date('2017/06/27 17:32'),
            doseWindowMinutes: 7,
            milestones: [{
                description: 'beam on',
                time: new Date('2017/06/27 17:32')
            }, {
                description: 'beam off',
                time: new Date('2017/06/27 17:35')
            }, {
                description: 'synthesis complete',
                time: new Date('2017/06/27 17:40')
            }, {
                description: 'QC complete',
                time: new Date('2017/06/27 17:45')
            }
            ]
        }
    ];

    private appointmentData: Array<any> = [
        {
            name: 'Natasha Romanoff',
            startTime: new Date('2017/06/27 17:15'),
            protocol: 'Exercise Stress',
            length: 30
        },
        {
            name: 'Oswald Cobblepot',
            startTime: new Date('2017/06/27 18:00'),
            protocol: 'High BMI',
            length: 30
        }
    ]

    private scanData: Array<any> = [
        {
            name: 'SCAN 1',
            type: 'Rest',
            dose: '10 mCi',
            startTime: new Date('2017/06/27 17:20'),
            length: 8.7
        },
        {
            name: 'SCAN 2',
            type: 'Stress',
            dose: '20 mCi',
            startTime: new Date('2017/06/27 17:35'),
            length: 8.7
        },
        {
            name: 'SCAN 1',
            type: 'Rest',
            dose: '10 mCi',
            startTime: new Date('2017/06/27 18:20'),
            length: 8.7
        },
        {
            name: 'SCAN 2',
            type: 'Stress',
            dose: '20 mCi',
            startTime: new Date('2017/06/27 18:35'),
            length: 8.7
        }
    ]

    private upPointerSVG = 'M 0 70 L 0 30 Q 0 10 20 10 L 60 10 L 70 0 L 80 10 L 120 10 Q 140 10 140 30 L 140 70';
    private roundedRectTop = 'M 0 40 L 0 10 Q 0 0 10 0 L 130 0 Q 140 0 140 10 L 140 40';
    private roundedRectBottom = 'M 0 40 L 0 50 Q 0 60 10 60 L 130 60 Q 140 60 140 50 L 140 40';

    ngAfterViewInit() {
        //this.htmlElement = this.element.nativeElement;
        this.host = D3.select(this.element.nativeElement);
        this.canvasWidth = this.host.node().getBoundingClientRect().width;
        this.canvasHeight = this.host.node().getBoundingClientRect().height;
        this.timeCoordinates.rescale(this.canvasWidthMinutes, this.canvasWidth, this.relativeStartMinutes);

        //redraw every 15 seconds
        let countDown = Observable.timer(15 * 1000, 15 * 1000)
            .subscribe(() => {
                this.drawDoseSVG()
            });
        this.updateDemoTimes();
        this.drawDoseSVG();
    }
    //DEMO only to hard code time in the future
    private updateDemoTimes(): void {
        var nowMinutes = (new Date()).getTime() / 60000;
        this.doseData[0].estimatedDeliveryTime = new Date((nowMinutes + 12) * 60000);
        this.doseData[0].milestones[0].time = new Date((nowMinutes - 8) * 60000);
        this.doseData[0].milestones[1].time = new Date((nowMinutes - 2) * 60000);
        this.doseData[0].milestones[2].time = new Date((nowMinutes + 4) * 60000);
        this.doseData[0].milestones[3].time = new Date((nowMinutes + 8) * 60000);
        this.doseData[1].estimatedDeliveryTime = new Date((nowMinutes + 30) * 60000);
        this.doseData[1].milestones[0].time = new Date((nowMinutes + 20) * 60000);
        this.doseData[1].milestones[1].time = new Date((nowMinutes + 22) * 60000);
        this.doseData[1].milestones[2].time = new Date((nowMinutes + 24) * 60000);
        this.doseData[1].milestones[3].time = new Date((nowMinutes + 26) * 60000);
        this.appointmentData[0].startTime = new Date((nowMinutes + 15) * 60000);
        this.appointmentData[1].startTime = new Date((nowMinutes + 50) * 60000);
        this.scanData[0].startTime = new Date((nowMinutes + 17) * 60000);
        this.scanData[1].startTime = new Date((nowMinutes + 33) * 60000);
        this.scanData[2].startTime = new Date((nowMinutes + 52) * 60000);
        this.scanData[3].startTime = new Date((nowMinutes + 67) * 60000);
    }

    updateDataArray() {

        if (this.doseData.length > this.configData.length) {
            this.doseData.splice(this.configData.length);
        }

        this.doseData.forEach((element, i) => {
            element.x = this.timeCoordinates.getX(element.estimatedDeliveryTime)
            element.minutesAway = (element.estimatedDeliveryTime.getTime() - (new Date()).getTime()) / 1000 / 60;
            //copy the config data for convenience
            element.color = this.configData[i].color;
            element.arcColor = this.configData[i].arcColor;
            element.y = this.configData[i].y;
        });
    }
    private zoomed() {
        console.log(D3.event.transform);
        //this is fine for a static image, but won't work in this date
        //this.svg.attr('transform', D3.event.transform);
        //will need to draw after determining new canvas width etc.
    }

    private drawDoseSVG(): void {

        let doseWidth = 200;
        let nowX: number = this.timeCoordinates.getX(new Date());
        this.updateDataArray();

        this.host.html('');

        this.svg = this.host.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('font-family', 'Roboto')
            .call(D3.zoom().on('zoom', () => this.zoomed()))
            .append("g");

        //create a group to hold the grid lines in the back
        this.svg.append("g").attr("id", "gridlines");

        this.drawPatientSVG();
        //draw current time vertical line
        let vLineNow = this.svg.select("#gridlines")
            .append('svg:line')
            .attr('x1', nowX)
            .attr('y1', '0%')
            .attr('x2', nowX)
            .attr('y2', '100%')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        //create gradient for dose box
        let gradient = this.svg.append("defs").selectAll("linearGradient")
            .data(this.doseData)
            .enter()
            .append("linearGradient")
            .attr("id", (d, i) => "linear" + i)
            .attr("x1", "0%")
            .attr("y1", "50%")
            .attr("x2", "100%")
            .attr("y2", "50%")
            .attr("spreadMethod", "pad");

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", d => d.color)
            .attr("stop-opacity", 0.4);

        gradient.append("svg:stop")
            .attr("offset", "50%")
            .attr("stop-color", d => d.color)
            .attr("stop-opacity", 0.6);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", d => d.color)
            .attr("stop-opacity", 0.4);

        //draw dose box
        let rect = this.svg.selectAll('doseRect')
            .data(this.doseData)
            .enter()
            .append('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y - this.circleRadius)
            .attr('width', d => this.timeCoordinates.getWidth(d.doseWindowMinutes))
            .attr('height', this.circleRadius * 2)
            .style('fill', (d, i) => 'url(#linear' + i + ')');

        //vertical line at dose
        let vLine = this.svg.select("#gridlines").selectAll('vline')
            .data(this.doseData)
            .enter()
            .append('svg:line')
            .attr('x1', d => d.x)
            .attr('y1', '0%')
            .attr('x2', d => d.x)
            .attr('y2', '100%')
            .attr('stroke', d => d.color)
            .attr('stroke-dasharray', '2,3');

        //horizontal milestone line for a dose
        let hLine = this.svg.select("#gridlines").selectAll('hline')
            .data(this.doseData)
            .enter()
            .append('svg:line')
            .attr('x1', 0)
            .attr('y1', d => d.y)
            .attr('x2', d => d.x + this.timeCoordinates.getWidth(d.doseWindowMinutes))
            .attr('y2', d => d.y)
            .attr('stroke-width', 2)
            .attr('stroke', d => d.color);

        //the white dose circle
        let circle = this.svg.selectAll('circle')
            .data(this.doseData)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', this.circleRadius)
            .attr('fill', 'white');

        //the label on the dose circle
        let arcText = this.svg.selectAll('arcText')
            .data(this.doseData)
            .enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('text-anchor', 'middle')
            .attr('fill', d => d.arcColor)
            .style("font-size", "24px")
            .text(d => this.timeCoordinates.minutesLabel(d.minutesAway))
            .append('tspan')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 14)
            .style("font-size", "12px")
            .text(d => { if (d.minutesAway < 0) { return ''; } else { return 'AWAY'; } });

        //data for arc for dose circle
        let arcdata = D3.arc()
            .startAngle(0)
            .endAngle((d: any) => this.timeCoordinates.minutesAwayToRadius(d.minutesAway))
            .innerRadius(this.circleRadius * 0.92)
            .outerRadius(this.circleRadius * 1.08)
            .cornerRadius(20);

        //the time arc surrounding a dose circle
        let arc = this.svg.selectAll('arcProgress')
            .data(this.doseData)
            .enter()
            .append('svg:path')
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
            .attr('fill', d => d.arcColor)
            .attr('d', arcdata);

        //arrival time pointer
        let arrivalPointer = this.svg.selectAll('arrivalPointer')
            .data(this.doseData)
            .enter()
            .append('svg:path')
            .attr('transform', d => 'translate(' + (d.x - this.pointerBoxWidth / 2) + ',' + (this.canvasHeight - this.pointerBoxHeight) + ')')
            .attr('fill', d => d.color)
            .attr('d', this.upPointerSVG);

        //the label on the arrival time pointer
        let arrivalTextBox = this.svg.selectAll('arrivalText')
            .data(this.doseData)
            .enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', d => this.canvasHeight - 31)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style("font-size", "20px")
            .text(d => moment(d.estimatedDeliveryTime).format('hh:mm A'))
            .append('tspan')
            .attr('x', d => d.x)
            .attr('y', d => this.canvasHeight - 15)
            .style("font-size", "14px")
            .text((d, i) => 'DOSE ' + (i + 1) + ' ARRIVAL');

        //now pointer
        let nowRect = this.svg
            .append('svg:path')
            .attr('transform', d => 'translate(' + (nowX + this.pointerBoxWidth / 2) + ',' + this.pointerBoxHeight + ') rotate(180)')
            .attr('fill', '#464646')
            .attr('d', this.upPointerSVG);

        //label on the now pointer
        let nowTextBox = this.svg
            .append('text')
            .attr('x', nowX)
            .attr('y', 45)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style("font-size", "20px")
            .text(d => moment().format('hh:mm A'))
            .append('tspan')
            .attr('x', nowX)
            .attr('y', 27)
            .style("font-size", "14px")
            .text((d, i) => 'CURRENT TIME');

        //the white dose circle
        var nestedDose = this.svg.selectAll('nestedDose')
            .data(this.doseData)
            .enter()
            .append('g');

        nestedDose.each((dose, i) => {
            let milestoneCircle = this.svg.selectAll('milestoneCircle')
                .data(dose.milestones)
                .enter()
                .append('circle')
                .attr('cx', d => this.timeCoordinates.getX(d.time))
                .attr('cy', dose.y)
                .attr('r', 8)
                .attr('fill', 'white')
                .style('stroke', dose.arcColor)
                .append('title').text(d => d.description);
        });
    }
    private drawPatientSVG(): void {

        let rect = this.svg.selectAll('patientRect')
            .data(this.appointmentData)
            .enter()
            .append('rect')
            .attr('x', d => this.timeCoordinates.getX(d.startTime))
            .attr('y', this.appointmentConfig.y)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr('width', d => this.timeCoordinates.getWidth(d.length))
            .attr('height', this.circleRadius * 2)
            .style('fill', this.appointmentConfig.color)
            .attr("opacity", 0.2);

        let nameText = this.svg.selectAll('nameText')
            .data(this.appointmentData)
            .enter()
            .append('text')
            .attr('x', d => this.timeCoordinates.getX(d.startTime))
            .attr('y', d => this.appointmentConfig.y - 5)
            .attr('fill', 'black')
            .style("font-size", "14px")
            .style("font-weight", "bold")
            //.attr('text-anchor', 'middle')
            .text(d => d.name);

        let scanRect = this.svg.selectAll('scanRect')
            .data(this.scanData)
            .enter()
            .append('svg:path')
            .attr('transform', d => 'translate(' + this.timeCoordinates.getX(d.startTime) + ',' + (this.appointmentConfig.y + (this.circleRadius * .25)) + ')')
            .attr('fill', this.appointmentConfig.color)
            .attr('d', this.roundedRectTop);

        let scanRectBottom = this.svg.selectAll('scanRectBottom')
            .data(this.scanData)
            .enter()
            .append('svg:path')
            .attr('transform', d => 'translate(' + this.timeCoordinates.getX(d.startTime) + ',' + (this.appointmentConfig.y + (this.circleRadius * .25)) + ')')
            .attr('fill', 'white')
            .attr('d', this.roundedRectBottom);

        let scanText = this.svg.selectAll('scanText')
            .data(this.scanData)
            .enter()
            .append('text')
            .attr('x', d => this.timeCoordinates.getX(d.startTime) + 5)
            .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * .5) + 5))
            .attr('fill', 'black')
            .style("font-size", "12px")
            .text(d => d.name)
            .append('tspan')
            .attr('x', d => this.timeCoordinates.getX(d.startTime) + 5)
            .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * 1.5) + 5))
            .text(d => d.type)
            .append('tspan')
            .attr('text-anchor', 'end')
            .attr('x', d => this.timeCoordinates.getX(d.startTime) + this.timeCoordinates.getWidth(d.length))
            .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * 1.5) + 5))
            .text(d => d.dose);

    }

}
