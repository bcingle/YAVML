import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleService } from './vehicle.service';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { VehicleEditorComponent } from './vehicles/vehicle-editor/vehicle-editor.component';
import { NhtsaService } from './nhtsa.service';
import { VehicleStore } from './vehicle-store.service';
import { NewVehicleService } from './new-vehicle.service';
import { AuthService } from './auth/auth.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { MessageService } from './message.service';
import { SplashComponent } from './splash/splash.component';
import { WebStorageService } from './web-storage.service';
import { VehicleEditorDetailsComponent } from './vehicles/vehicle-editor/vehicle-editor-details/vehicle-editor-details.component';
import { VehicleEditorDocumentsComponent } from './vehicles/vehicle-editor/vehicle-editor-documents/vehicle-editor-documents.component';
import { VehicleEditorMaintenanceComponent } from './vehicles/vehicle-editor/vehicle-editor-maintenance/vehicle-editor-maintenance.component';
import { VehicleEditorFuelComponent } from './vehicles/vehicle-editor/vehicle-editor-fuel/vehicle-editor-fuel.component';
import { NewVehicleComponent } from './vehicles/new-vehicle/new-vehicle.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { EditVehicleComponent } from './vehicles/edit-vehicle/edit-vehicle.component';
import { AddDocumentComponent } from './vehicles/add-document/add-document.component';
import { ListDocumentsComponent } from './vehicles/list-documents/list-documents.component';
import { InlineEditComponent } from './directives/inline-edit/inline-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    VehicleEditorComponent,
    AuthCallbackComponent,
    SplashComponent,
    VehicleEditorDetailsComponent,
    VehicleEditorDocumentsComponent,
    VehicleEditorMaintenanceComponent,
    VehicleEditorFuelComponent,
    NewVehicleComponent,
    VehicleListComponent,
    EditVehicleComponent,
    AddDocumentComponent,
    ListDocumentsComponent,
    InlineEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    VehicleService,
    NhtsaService,
    VehicleStore,
    NewVehicleService,
    AuthService,
    MessageService,
    WebStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
