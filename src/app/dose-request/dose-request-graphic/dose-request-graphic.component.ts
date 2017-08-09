import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as D3 from 'd3';
import { Path, Selection } from 'd3';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import * as moment from 'moment';

import { TimeCoordinates } from '../../time-coordinates';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-dose-request-graphic',
  templateUrl: './dose-request-graphic.component.html',
  styleUrls: ['./dose-request-graphic.component.css']
})

export class DoseRequestGraphicComponent implements AfterViewInit {

  constructor(private dataService: DataService) {
  }

  @ViewChild('container') element: ElementRef;
  //private htmlElement: HTMLElement;
  private host;
  private svg;
  private timeCoordinates = new TimeCoordinates();
  //component sizing
  private circleRadius = 40;
  private pointerBoxHeight = 70;
  private pointerBoxWidthMinutes = 10;

  //window configuration
  private canvasWidth: number;
  private canvasHeight: number;
  private originalWidthMinutes = 90;
  private canvasWidthMinutes = this.originalWidthMinutes;
  private originalRelativeStartMinutes = -15;
  private relativeStartMinutes = this.originalRelativeStartMinutes;

  public doseData: Array<any>;
  public appointmentData: Array<any>;
  public scanData: Array<any>;

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


  ngAfterViewInit() {
    this.host = D3.select(this.element.nativeElement);
    this.canvasWidth = this.host.node().getBoundingClientRect().width;
    if (this.canvasWidth < 800) {
      //force it to take up at least 800 pixels in width, or more if space allows.
      this.canvasWidth = 800;
    }

    D3.select(window).on('resize', () => this.setWindowSize());
    //redraw every 15 seconds
    let countDown = Observable.timer(15 * 1000, 15 * 1000)
      .subscribe(() => {
        this.drawDoseSVG()
      });
    this.dataService.updateDemoData();
    this.appointmentData = this.dataService.appointmentData;
    this.doseData = this.dataService.doseData;
    this.scanData = this.dataService.scanData;
    this.setWindowSize();
  }


  private setWindowSize(): void {
    //only rescale based on height. We don't want resize to change scale on x axis.
    this.canvasHeight = this.host.node().getBoundingClientRect().height;

    this.timeCoordinates.rescale(this.canvasWidthMinutes, this.canvasWidth, this.relativeStartMinutes);

    this.drawDoseSVG();
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
    if (D3.event.transform.k === 1) {
      //pan
      //only temporarily update the relativeStartMinutes, the final zoomEnd is when the relative start minutes are updated.
      this.timeCoordinates.rescale(this.canvasWidthMinutes,
        this.canvasWidth,
        this.relativeStartMinutes - (this.canvasWidthMinutes * D3.event.transform.x / this.canvasWidth));
      this.drawDoseSVG();
    } else if (D3.event.transform.k > 1) {
      //zoomIn
      this.executeZoom(0.1);
    } else {
      //zoomOut
      this.executeZoom(-0.1);
    }
  }

  private zoomEnd() {
    if (D3.event.transform.k === 1) {
      //pan
      this.relativeStartMinutes = this.relativeStartMinutes - (this.canvasWidthMinutes * D3.event.transform.x / this.canvasWidth);
      this.timeCoordinates.rescale(this.canvasWidthMinutes,
        this.canvasWidth,
        this.relativeStartMinutes);
      this.drawDoseSVG();
    }
  }

  public executeZoom(factor: number) {
    this.canvasWidthMinutes = this.canvasWidthMinutes + (this.originalWidthMinutes * factor);
    this.timeCoordinates.rescale(this.canvasWidthMinutes,
      this.canvasWidth,
      this.relativeStartMinutes);
    this.drawDoseSVG();
  }

  public resetZoom(): void {
    this.canvasWidthMinutes = this.originalWidthMinutes;
    this.relativeStartMinutes = this.originalRelativeStartMinutes;
    this.timeCoordinates.rescale(this.canvasWidthMinutes,
      this.canvasWidth,
      this.relativeStartMinutes);
    this.drawDoseSVG();
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
      .call(D3.zoom().on('zoom', () => this.zoomed())
        .on('end', () => this.zoomEnd()))
      .append('g');

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


    let scaledRadius = DoseRequestGraphicComponent.getCircleRadius(this.timeCoordinates.getWidth(this.pointerBoxWidthMinutes));
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
      .attr('x1', d => this.timeCoordinates.getX(d.milestones[0].time))
      .attr('y1', d => d.y)
      .attr('x2', d => d.x + this.timeCoordinates.getWidth(d.doseWindowMinutes))
      .attr('y2', d => d.y)
      .attr('stroke-width', 2)
      .attr('stroke', d => d.color);

    //the white milestone circles
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
        .attr('r', 10)
        .attr('fill', 'white')
        .style('stroke', dose.arcColor)
        .append('title').text(d => d.description);
    });

    //the white dose circle
    let circle = this.svg.selectAll('doseCircle')
      .data(this.doseData)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', scaledRadius)
      .attr('fill', 'white');

    //the label on the dose circle
    let arcText = this.svg.selectAll('arcText')
      .data(this.doseData)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 2)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.arcColor)
      .style('font-size', DoseRequestGraphicComponent.timeFontSize(this.timeCoordinates.getWidth(this.pointerBoxWidthMinutes)))
      .style('font-weight', 'bold')
      .style('visibility', d => (scaledRadius >= 20) ? 'visible' : 'hidden')
      .text(d => this.timeCoordinates.minutesLabel(d.minutesAway))
      .append('tspan')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 19)
      .style('font-size', '12px')
      .text(d => { if (d.minutesAway < 0) { return ''; } else { return 'AWAY'; } })
      .style('visibility', d => (scaledRadius >= 40) ? 'visible' : 'hidden');

    //data for arc for dose circle
    let arcdata = D3.arc()
      .startAngle(0)
      .endAngle((d: any) => this.timeCoordinates.minutesAwayToRadius(d.minutesAway))
      .innerRadius(scaledRadius * 0.92)
      .outerRadius(scaledRadius * 1.08)
      .cornerRadius(20);

    //the time arc surrounding a dose circle
    let arc = this.svg.selectAll('arcProgress')
      .data(this.doseData)
      .enter()
      .append('svg:path')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .attr('fill', d => d.arcColor)
      .attr('d', arcdata);

    let pointerBoxWidth: number = this.timeCoordinates.getWidth(this.pointerBoxWidthMinutes);
    let pointerBoxHeight = 70;
    if (pointerBoxWidth < 120) pointerBoxHeight = 40;

    //arrival time pointer
    let arrivalPointer = this.svg.selectAll('arrivalPointer')
      .data(this.doseData)
      .enter()
      .append('svg:path')
      .attr('transform', d => 'translate(' + (d.x - (pointerBoxWidth / 2)) + ',' + (this.canvasHeight - pointerBoxHeight) + ')')
      .attr('fill', d => d.color)
      .attr('d', DoseRequestGraphicComponent.upPointerPath(pointerBoxWidth, pointerBoxHeight));

    //the label on the arrival time pointer
    let arrivalTextBox = this.svg.selectAll('arrivalText')
      .data(this.doseData)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => this.canvasHeight - pointerBoxHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', DoseRequestGraphicComponent.timeFontSize(pointerBoxWidth))
      .style('visibility', d => (pointerBoxWidth > 60) ? 'visible' : 'hidden')
      .text(d => moment(d.estimatedDeliveryTime).format('hh:mm A'))
      .append('tspan')
      .attr('x', d => d.x)
      .attr('y', d => this.canvasHeight - pointerBoxHeight + 55)
      .style("font-size", "14px")
      .style('visibility', d => (pointerBoxWidth > 120) ? 'visible' : 'hidden')
      .text((d, i) => 'DOSE ' + (i + 1) + ' ARRIVAL');

    //now pointer
    let nowRect = this.svg
      .append('svg:path')
      .attr('transform', d => 'translate(' + (nowX + (pointerBoxWidth / 2)) + ',' + pointerBoxHeight + ') rotate(180)')
      .attr('fill', '#464646')
      .attr('d', DoseRequestGraphicComponent.upPointerPath(pointerBoxWidth, pointerBoxHeight));

    //label on the now pointer
    let nowTextBox = this.svg
      .append('text')
      .attr('x', nowX)
      .attr('y', pointerBoxHeight - 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', DoseRequestGraphicComponent.timeFontSize(pointerBoxWidth))
      .style('visibility', d => (pointerBoxWidth > 60) ? 'visible' : 'hidden')
      .text(d => moment().format('hh:mm A'))
      .append('tspan')
      .attr('x', nowX)
      .attr('y', pointerBoxHeight - 45)
      .style("font-size", "14px")
      .style('visibility', d => (pointerBoxWidth > 120) ? 'visible' : 'hidden')
      .text((d, i) => 'CURRENT TIME');

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
      .style('visibility', d => (this.timeCoordinates.getWidth(d.length) > 120) ? 'visible' : 'hidden')
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
      .attr('d', d => DoseRequestGraphicComponent.roundedRectTopPath(this.timeCoordinates.getWidth(d.length), 40));

    let scanRectBottom = this.svg.selectAll('scanRectBottom')
      .data(this.scanData)
      .enter()
      .append('svg:path')
      .attr('transform', d => 'translate(' + this.timeCoordinates.getX(d.startTime) + ',' + (this.appointmentConfig.y + (this.circleRadius * .25) + 40) + ')')
      .attr('fill', 'white')
      .attr('d', d => DoseRequestGraphicComponent.roundedRectBottomPath(this.timeCoordinates.getWidth(d.length), 20));

    let scanText = this.svg.selectAll('scanText')
      .data(this.scanData)
      .enter()
      .append('text')
      .attr('x', d => this.timeCoordinates.getX(d.startTime) + 5)
      .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * .5) + 5))
      .style('visibility', d => (this.timeCoordinates.getWidth(d.length) > 50) ? 'visible' : 'hidden')
      .attr('fill', 'black')
      .style("font-size", "12px")
      .text(d => d.name)
      .append('tspan')
      .attr('x', d => this.timeCoordinates.getX(d.startTime) + 5)
      .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * 1.5) + 5))
      .style('visibility', d => (this.timeCoordinates.getWidth(d.length) > 50) ? 'visible' : 'hidden')
      .text(d => d.type)
      .append('tspan')
      .attr('text-anchor', 'end')
      .attr('x', d => this.timeCoordinates.getX(d.startTime) + this.timeCoordinates.getWidth(d.length) - 5)
      .attr('y', d => (this.appointmentConfig.y + (this.circleRadius * 1.5) + 5))
      .style('visibility', d => (this.timeCoordinates.getWidth(d.length) > 120) ? 'visible' : 'hidden')
      .text(d => d.dose);

  }
  private static roundedRectTopPath(width: number, height: number): Path {
    let cornerRadius = 10;
    if (width < 20) {
      cornerRadius = width / 2;
    }
    let path = D3.path();
    path.moveTo(0, height);
    path.lineTo(0, cornerRadius);
    path.quadraticCurveTo(0, 0, cornerRadius, 0)
    path.lineTo(width - cornerRadius, 0);
    path.quadraticCurveTo(width, 0, width, cornerRadius);
    path.lineTo(width, height);
    path.closePath();
    return path;
  }

  private static roundedRectBottomPath(width: number, height: number): Path {
    let cornerRadius = 10;
    if (width < 20) {
      cornerRadius = width / 2;
    }
    let path = D3.path();
    path.moveTo(0, 0);
    path.lineTo(0, height - cornerRadius);
    path.quadraticCurveTo(0, height, cornerRadius, height)
    path.lineTo(width - cornerRadius, height);
    path.quadraticCurveTo(width, height, width, height - cornerRadius);
    path.lineTo(width, 0);
    path.closePath();
    return path;
  }


  private static upPointerPath(width: number, height: number): Path {
    let cornerRadius = 10;
    if (width < 40) {
      cornerRadius = width / 4;
    }
    let path = D3.path();
    path.moveTo(0, height);
    path.lineTo(0, cornerRadius * 3);
    path.quadraticCurveTo(0, cornerRadius, cornerRadius * 2, cornerRadius);
    path.lineTo((width / 2) - cornerRadius, cornerRadius);
    path.lineTo((width / 2), 0);
    path.lineTo((width / 2) + cornerRadius, cornerRadius);
    path.lineTo(width - (cornerRadius * 2), cornerRadius);
    path.quadraticCurveTo(width, cornerRadius, width, cornerRadius * 3);
    path.lineTo(width, height);
    path.closePath();
    return path;
  }

  private static timeFontSize(pixelWidth): string {
    if (pixelWidth > 120) {
      return "20px";
    } else if (pixelWidth > 90) {
      return "16px";
    } else {
      return "12px";
    }
  }
  private static getCircleRadius(pixelWidth): number {
    if (pixelWidth > 120) {
      return 40;
    } else if (pixelWidth > 90) {
      return 30;
    } else if (pixelWidth > 60) {
      return 20;
    }
    return 10;
  }


}
