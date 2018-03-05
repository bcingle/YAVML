import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { NhtsaVinResult } from './nhtsa-vin-result';
import { of } from 'rxjs/observable/of';

@Injectable()
export class NhtsaService {

  private apiRoot = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  constructor(private http: HttpClient) { }

  getVehicleMakes(): Observable<string[]> {
    // how does this work?
    // The API returns a wrapper around the actual results.  The results array is found
    // as the Results key in the returned object.  The pipe takes the actual response
    // from the API, extracts the Results array, and returns that array as an array
    // of NhtsaMake objects.  In order for this to work, each element in the Results array must
    // match the NhtsaMake model class.
    return this.http.get<any>(this.apiRoot + `/GetAllMakes?format=json`).pipe<string[]>(
      map(response => {
        const makes: string[] = [];
        for (const result of response['Results']) {
          makes.push(result['Make_Name']);
        }
        return makes;
      })
    );
  }

  /**
   * Obtain a list of models by make and (optionally) model year
   * @param make make of vehicle
   * @param year model year of vehicle
   */
  getVehicleModelsByMake(make: string, year?: number): Observable<string[]> {
    let url: string;
    if (year !== null) {
      url = this.apiRoot + `/getmodelsformake/${make}/modelyear/${year}?format=json`;
    } else {
      url = this.apiRoot + `/getmodelsformake/${make}?format=json`;
    }
    return this.http.get<any>(url).pipe<string[]>(
      map(response => {
        const models: string[] = [];
        for (const result of response['Results']) {
          models.push(result['Model_Name']);
        }
        return models;
      })
    );
  }

  /**
   * Search for vehicle details by vin and model year
   * @param vin vin number to search
   * @param year model year of vin
   */
  getDecodedVin(vin: string, year: number): Observable<NhtsaVinResult[]> {
    console.log('Decoding vin ' + vin);
    if (vin.trim() === '' || year < 1900) {
      console.log('Empty vin or year');
      return of([]);
    }
    const url: string = this.apiRoot + `/decodevinvalues/${vin}?format=json&modelyear=${year}`;
    return this.http.get<any>(url).pipe<NhtsaVinResult[]>(
      map(response => {
        console.log(response);
        const results: NhtsaVinResult[] = [];
        for (const result of response['Results']) {
          if (result['Make'] && result['Model'] && result['ModelYear'] && result['Trim'] && result['VIN']) {
            const resultObj = new NhtsaVinResult();
            resultObj.make = result['Make'];
            resultObj.model = result['Model'];
            resultObj.year = result['ModelYear'];
            resultObj.trim = result['Trim'];
            resultObj.vin = result['VIN'];
            results.push(resultObj);
            console.log(resultObj);
          }
        }
        return results;
      })
    );
  }

}
