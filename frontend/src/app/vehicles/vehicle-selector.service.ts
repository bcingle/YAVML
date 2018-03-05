import { Injectable } from '@angular/core';
import { Vehicle } from '../vehicle';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class VehicleSelectorService {

  selectedVehicle$: Observable<Vehicle>;

  private _selectedVehicle: BehaviorSubject<Vehicle> = new BehaviorSubject(null);

  constructor() {
    this.selectedVehicle$ = this._selectedVehicle.asObservable();
  }

  selectVehicle(vehicle: Vehicle) {
    this._selectedVehicle.next(vehicle);
  }

  deselctVehicle() {
    this.selectVehicle(null);
  }

  getSelectedVehicle() {
    return this._selectedVehicle.getValue();
  }

}
