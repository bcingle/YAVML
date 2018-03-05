import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../vehicle.service';
import { VehicleSelectorService } from '../vehicle-selector.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  title: string;
  file: File;

  constructor(private vehicleService: VehicleService, private vehicleSelector: VehicleSelectorService, private location: Location) { }

  ngOnInit() {
  }

  fileChange(files: File[]) {
    console.log('File selected');
    console.log(files);
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  upload() {
    console.log('Update button clicked');
    console.log(this.title);
    console.log(this.file);
    if (this.title && this.file) {
      console.log('Uploading document');
      this.vehicleService.addVehicleDocument(this.vehicleSelector.getSelectedVehicle(),
        this.title, this.file).subscribe(() => {
          this.location.back();
        });
    }
  }

}
