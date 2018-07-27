import { Component, OnInit } from '@angular/core';

import { Vehicle } from '../vehicle';
import { VehicleStore } from '../vehicle-store.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';
import { VehicleSelectorService } from './vehicle-selector.service';
import { WaitingService } from '../waiting.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
  providers: [VehicleSelectorService]
})
export class VehiclesComponent implements OnInit {

  selectedVehicle: BehaviorSubject<Vehicle> = new BehaviorSubject(null);

  selectedVehicle$: Observable<Vehicle> = this.selectedVehicle.asObservable();

  newVehicle: Vehicle;

  working = false;

  constructor(private vehicleService: VehicleStore, private auth: AuthService,
    private waitingService: WaitingService) { }

  ngOnInit() { }


  deleteVehicle(vehicle: Vehicle): void {
    this.working = true;
    this.waitingService.wait();
    this.vehicleService.deleteVehicle(vehicle).subscribe(() => {
      if (vehicle === this.selectedVehicle.getValue()) {
        this.selectedVehicle.next(null);
      }
      this.working = false;
      this.waitingService.doneWaiting();
    });
  }

  selectVehicle(vehicle: Vehicle) {
    console.log('Selecting vehicle');
    console.log(vehicle);
    this.selectedVehicle.next(vehicle);
  }

  addVehicle() {
    this.working = true;
    this.waitingService.wait();
    this.vehicleService.addVehicle(this.newVehicle).subscribe(addedVehicle => {
      this.selectVehicle(addedVehicle);
      this.cancelNewVehicle();
      this.working = false;
      this.waitingService.doneWaiting();
    });
  }

  showNewVehicle() {
    this.newVehicle = new Vehicle();
  }

  cancelNewVehicle() {
    this.newVehicle = null;
  }

  updateSelectedVehicle() {
    this.updateVehicle(this.selectedVehicle.getValue());
  }

  updateVehicle(vehicle: Vehicle) {
    this.working = true;
    this.waitingService.wait();
    this.vehicleService.editVehicle(vehicle).subscribe(() => {
      this.working = false;
      this.waitingService.doneWaiting();
    });
  }

  refresh() {
    this.selectedVehicle.next(null);
    this.vehicleService.refreshVehicleList();
  }

}
