import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DataService } from './shared/data.service';
import { DoseDataService } from './shared/dose-data.service';
import { DoseRequestGraphicComponent } from './dose-request/dose-request-graphic/dose-request-graphic.component';
import { DoseRequestAppointmentBarComponent } from './dose-request/dose-request-appointment-bar/dose-request-appointment-bar.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DoseRequestGraphicComponent,
    DoseRequestAppointmentBarComponent,
    AppointmentListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    DataService,
    DoseDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
