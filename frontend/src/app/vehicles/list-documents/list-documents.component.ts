import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, AfterContentChecked } from '@angular/core';
import { VehicleSelectorService } from '../vehicle-selector.service';
import { VehicleService } from '../../vehicle.service';
import { Vehicle } from '../../vehicle';
import { WaitingService } from '../../waiting.service';
import { MessageService } from '../../message.service';

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

  constructor(private vehicleSelector: VehicleSelectorService,
    private vehicleService: VehicleService,
    private waitingService: WaitingService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.vehicle = this.vehicleSelector.getSelectedVehicle();

    this.refreshDocuments();
  }

  refreshDocuments() {
    this.waitingService.wait();
    this.vehicleService.getVehicleDocuments(this.vehicle).subscribe(documents => {
      this.documents = documents;
      this.waitingService.doneWaiting();
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

  download(document) {
    this.waitingService.wait();
    this.vehicleService.downloadDocument(document.id).subscribe(blob => {
      this.waitingService.doneWaiting();
      if (window.URL && window.URL.createObjectURL) {
        // for modern browsers
        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = '_blank';
        anchor.download = document.filename;
        anchor.click();
      } else if (window.navigator && window.navigator.msSaveBlob) {
        // for IE
        window.navigator.msSaveBlob(blob, document.filename);
      } else {
        // unsupported browser
        this.messageService.push('Cannot download file (unsupported browser)');
      }
    });
  }

}
