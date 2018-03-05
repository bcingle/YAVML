import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../vehicle';
import { Location } from '@angular/common';
import { VehicleStore } from '../../vehicle-store.service';
import { VehicleSelectorService } from '../vehicle-selector.service';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.component.html',
  styleUrls: ['./new-vehicle.component.css']
})
export class NewVehicleComponent implements OnInit {

  newVehicle = new Vehicle();

  constructor(private location: Location, private vehicleService: VehicleStore) { }

  ngOnInit() {
  }

  addVehicle() {
    this.vehicleService.addVehicle(this.newVehicle);
  }

  cancel() {
    this.location.back();
  }

}
