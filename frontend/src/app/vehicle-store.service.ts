import { Injectable } from '@angular/core';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VehicleStore {

  // _vehicles is a subject that can be midified by the modifier methods
  private _vehicles: BehaviorSubject<Vehicle[]>;

  private authSubscription: Subscription;

  // vehicles$ is a readonly observable that can be subscribed to directly by others
  public readonly vehicles$: Observable<Vehicle[]>;

  constructor(private vehicleService: VehicleService, private auth: AuthService) {
    this._vehicles = new BehaviorSubject(null);
    this.vehicles$ = this._vehicles.asObservable();
    this.initialize();
  }

  private initialize() {
    // wait until login is verified before refreshing the vehicle list
    // or refreshing will fail with no auth token
    this.authSubscription = this.auth.authChecked$.subscribe(checked => {
      if (checked) {
        this.refreshVehicleList();
        if (this.authSubscription) {
          this.authSubscription.unsubscribe(); // only refresh the first time, then unsubscribe
        }
      }
    });
  }

  refreshVehicleList(): Observable<Vehicle[]> {
    this._vehicles.next(null);
    const obs = this.vehicleService.getVehicles();
    obs.subscribe(vehicles => {
      this._vehicles.next(vehicles);
    });
    return obs;
  }

  /**
   * Add a vehicle to the Vehicle data store
   * @param vehicle the vehicle to add
   */
  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    // let the background service add the vehicle server-side
    const observable: Observable<Vehicle> = this.vehicleService.addVehicle(vehicle);
    // when successful, add the vehicle to the store's vehicle list
    observable.subscribe(newVehicle => {
      const vehArr = this._vehicles.getValue();
      vehArr.push(newVehicle);
      this._vehicles.next(vehArr);
    });
    // let the caller have access to the result also
    return observable;
  }

  /**
   * Remove a vehicle from the vehicle data store
   * @param vehicle The vehicle to delete
   */
  deleteVehicle(vehicle: Vehicle): Observable<any> {
    const observable: Observable<any> = this.vehicleService.deleteVehicle(+vehicle.id);
    observable.subscribe(() => {
      const veh = this._vehicles.getValue();
      const idx = veh.indexOf(vehicle);
      if (idx > -1) {
        veh.splice(idx, 1);
        this._vehicles.next(veh);
      }
    });
    return observable;
  }

  /**
   * Edit a vehicle
   * @param vehicle the vehicle to edit
   */
  editVehicle(vehicle: Vehicle): Observable<any> {
    const obs = this.vehicleService.updateVehicle(vehicle);
    obs.subscribe(() => {
      const veh = this._vehicles.getValue();
      const idx = veh.indexOf(vehicle);
      if (idx > -1) {
        veh[idx] = vehicle; // replace the vehicle object already in the array with this one
      } else {
        veh.push(vehicle); // add the vehicle if it wasn't already found
      }
      this._vehicles.next(veh);
    });
    return obs;
  }

  getVehicle(vehicleId): Observable<Vehicle> {
    if (!this._vehicles.getValue()) {
      const vehicleSub: Subject<Vehicle> = new Subject();
      this.vehicles$.subscribe(vehicles => {
        if (vehicles === null) {
          return;
        }
        for (const vehicle of vehicles) {
          if (vehicle.id === vehicleId) {
            vehicleSub.next(vehicle);
          }
        }
      });
      return vehicleSub.asObservable();
    } else {
      for (const vehicle of this._vehicles.getValue()) {
        if (vehicle.id === vehicleId) {
          return of(vehicle);
        }
      }
    }
  }

}
