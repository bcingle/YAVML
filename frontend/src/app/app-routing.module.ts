import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleEditorComponent } from './vehicles/vehicle-editor/vehicle-editor.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { NewVehicleComponent } from './vehicles/new-vehicle/new-vehicle.component';
import { VehicleEditorFuelComponent } from './vehicles/vehicle-editor/vehicle-editor-fuel/vehicle-editor-fuel.component';
import { VehicleEditorMaintenanceComponent } from './vehicles/vehicle-editor/vehicle-editor-maintenance/vehicle-editor-maintenance.component';
import { VehicleEditorDocumentsComponent } from './vehicles/vehicle-editor/vehicle-editor-documents/vehicle-editor-documents.component';
import { VehicleEditorDetailsComponent } from './vehicles/vehicle-editor/vehicle-editor-details/vehicle-editor-details.component';
import { AddDocumentComponent } from './vehicles/add-document/add-document.component';
import { ListDocumentsComponent } from './vehicles/list-documents/list-documents.component';

const routes: Routes = [
  {path: '', redirectTo: '/vehicles', pathMatch: 'full'},
  {path: 'home', redirectTo: '/vehicles'},
  {path: 'callback', component: AuthCallbackComponent},
  {path: 'vehicles', component: VehiclesComponent, children: [
    {path: 'new', component: NewVehicleComponent},
    {path: ':id', component: VehicleEditorComponent, children: [
      {path: 'fuel', component: VehicleEditorFuelComponent},
      {path: 'maintenance', component: VehicleEditorMaintenanceComponent},
      {path: 'documents', component: VehicleEditorDocumentsComponent, children: [
        {path: 'new', component: AddDocumentComponent},
        /*{path: ':docId', component: EditDocumentComponent},*/
        {path: '', component: ListDocumentsComponent, pathMatch: 'full'}
      ]},
      {path: 'edit', component: VehicleEditorDetailsComponent},
      {path: '**', redirectTo: 'fuel'}
    ]}
  ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
