import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
//import { MdToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DataService } from './shared/data.service';
import { DoseRequestGraphicComponent } from './dose-request/dose-request-graphic/dose-request-graphic.component';
import { DoseRequestPatientBarComponent } from './dose-request/dose-request-patient-bar/dose-request-patient-bar.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DoseRequestGraphicComponent,
    DoseRequestPatientBarComponent,
    AppointmentListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
