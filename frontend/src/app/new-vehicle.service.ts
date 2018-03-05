import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';

@Injectable()
export class NewVehicleService {

  constructor() { }

  public vehicle: Vehicle = new Vehicle();

}
