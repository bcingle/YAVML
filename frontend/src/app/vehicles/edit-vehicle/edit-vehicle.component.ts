import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../../vehicle';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {

  @Input()
  vehicle: Vehicle;

  @Output()
  vehicleChange: EventEmitter<Vehicle> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
