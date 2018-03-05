import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Vehicle } from '../../../vehicle';
import { ActivatedRoute } from '@angular/router';
import { VehicleStore } from '../../../vehicle-store.service';
import { NhtsaService } from '../../../nhtsa.service';
import { NhtsaVinResult } from '../../../nhtsa-vin-result';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VehicleSelectorService } from '../../vehicle-selector.service';

@Component({
  selector: 'app-vehicle-editor-details',
  templateUrl: './vehicle-editor-details.component.html',
  styleUrls: ['./vehicle-editor-details.component.css']
})
export class VehicleEditorDetailsComponent implements OnInit {

  @Input()
  vehicle: Vehicle;

  @Output()
  vehicleChange: EventEmitter<Vehicle> = new EventEmitter();

  // variables for storing vin search
  vinMatch$: Observable<NhtsaVinResult[]>;
  private vinSearchTerms = new Subject<{term: string, year: number}>();

  // variables for temporarily storing make and model lookup
  makes: string[];
  models: string[];

  // variables for make lookup
  makeMatch$: Observable<string[]>;
  private makeSearchTerms = new Subject<string>();

  // vehicles for model lookup
  modelMatch$: Observable<string[]>;
  private modelSearchTerms = new Subject<string>();

  constructor(private vehicleStore: VehicleStore,
    private vehicleSelector: VehicleSelectorService,
    private nhtsa: NhtsaService) { }

  ngOnInit() {
    console.log('VehicleEditorDetailsComponent initializing');
    console.log(this.vehicle);
    this.vehicleSelector.selectedVehicle$.subscribe(vehicle => this.vehicle = vehicle);
  }

    /**
   * Decode a VIN that was typed into the search box
   * @param vin the VIN
   * @param year the model year of the VIN
   */
  decodeVin(vin: string, year: number): void {
    if (!vin || year < 1900 || year > 3000) {
      return;
    }
    console.log('Added search ' + vin + ' ' + year);
    this.vinSearchTerms.next({term: vin, year: year});
  }

  /**
   * Select a matching vin to apply to vehicle details
   * @param vinMatch a vehicle match
   */
  selectVinMatch(vinMatch: NhtsaVinResult) {
    // copy specific properties from vin match to vehicle data
    this.vinResultToVehicle(vinMatch, this.vehicle);
  }

    /**
   * Populate vin search results into a vehicle object
   * @param result the vin search results
   * @param vehicle the vehicle
   */
  private vinResultToVehicle(result: NhtsaVinResult, vehicle: Vehicle): void {
    vehicle.vin = result.vin;
    vehicle.make = result.make;
    vehicle.model = result.model;
    vehicle.trim = result.trim;
    vehicle.year = result.year;
  }

    /**
   * Get a complete list of makes available (could be a big list)
   */
  getMakeList() {
    this.makes = [];
    this.nhtsa.getVehicleMakes().subscribe(makes => this.makes = makes);
  }

  /**
   * Get a list of models from the selected make
   */
  getModelList(make: string) {
    // get model list for the currently entered Make
    this.models = [];
    this.nhtsa.getVehicleModelsByMake(make).subscribe(models => this.models = models);
  }

  /**
   * Apply the updates to the vehicle
   */
  save() {
    if (this.vehicle.id) {
      this.vehicleStore.editVehicle(this.vehicle);
    } else {
      this.vehicleStore.addVehicle(this.vehicle);
    }
  }

}
