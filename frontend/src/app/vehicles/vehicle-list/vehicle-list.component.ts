import { Component, OnInit } from '@angular/core';
import { VehicleStore } from '../../vehicle-store.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  constructor(private vehicleService: VehicleStore) { }

  ngOnInit() {
  }

}
