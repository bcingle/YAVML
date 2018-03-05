import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, AfterContentChecked } from '@angular/core';
import { VehicleSelectorService } from '../vehicle-selector.service';
import { VehicleService } from '../../vehicle.service';
import { Vehicle } from '../../vehicle';

@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.css']
})
export class ListDocumentsComponent implements OnInit, AfterContentChecked {

  documents: any[];

  vehicle: Vehicle;

  editing = null;

  @ViewChild('editTitle')
  titleField: ElementRef;

  constructor(private vehicleSelector: VehicleSelectorService, private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicle = this.vehicleSelector.getSelectedVehicle();

    this.refreshDocuments();
  }

  refreshDocuments() {
    this.vehicleService.getVehicleDocuments(this.vehicle).subscribe(documents => {
      console.log(documents);
      this.documents = documents;
    });
  }

  ngAfterContentChecked() {
    if (this.titleField) {
      this.titleField.nativeElement.focus();
    }
  }

  edit(document) {
    this.editing = document;
  }

  updateSelected() {
    this.vehicleService.updateVehicleDocument(this.vehicle, this.editing).subscribe();
  }

  delete(document) {
    console.log(document);
    this.vehicleService.deleteDocument(this.vehicle, document.id).subscribe(_ => {
      let idx = this.documents.length;
      for ( ; idx >= 0; idx--) {
        if (this.documents[idx] === document) {
          this.documents.splice(idx, 1);
          return;
        }
      }
    });
  }

}
