import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vehicle } from '../../vehicle';
import { VehicleService } from '../../vehicle.service';
import { Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


import { NhtsaService } from '../../nhtsa.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';
import { NhtsaVinResult } from '../../nhtsa-vin-result';
import { VehicleStore } from '../../vehicle-store.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DoCheck } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { VehicleSelectorService } from '../vehicle-selector.service';

@Component({
  selector: 'app-vehicle-editor',
  templateUrl: './vehicle-editor.component.html',
  styleUrls: ['./vehicle-editor.component.css']
})
export class VehicleEditorComponent implements OnInit {

  @Input()
  vehicle: Vehicle;

  @Output()
  vehicleChange: EventEmitter<Vehicle> = new EventEmitter();

  constructor(private route: ActivatedRoute, private vehicleStore: VehicleStore, private vehicleSelector: VehicleSelectorService) { }

  ngOnInit() {
    console.log('Vehicle being displayed');
    console.log(this.vehicle);
    if (this.vehicle) {
      // only if vehicle was set explicitly using the @Input() decarator
      this.vehicleSelector.selectVehicle(this.vehicle);
    } else {
      // get vehicle from route params
      this.route.paramMap.subscribe(paramMap => {
        const id = paramMap.get('id');
        this.vehicleStore.getVehicle(id).subscribe(vehicle => {
          this.vehicle = vehicle;
          this.vehicleSelector.selectVehicle(this.vehicle);
          console.log('Loaded vehicle data');
          console.log(vehicle);
        });
      });
    }
  }

}
