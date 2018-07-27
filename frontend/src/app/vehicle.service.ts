import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, share } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Vehicle } from './vehicle';
import { MessageService } from './message.service';
import { AuthService } from './auth/auth.service';


@Injectable()
export class VehicleService {

  private apiUrl = 'http://192.168.1.2:8080/vehicles';

  constructor(private http: HttpClient, private messages: MessageService, private auth: AuthService) { }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Get Vehicles', [])),
      share());
  }

  getVehicleData(vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${vehicleId}`, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Get Vehicle Data', null)),
      share());
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${vehicleId}`, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Delete Vehicle')),
      share());
  }

  updateVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${vehicle.id}`, vehicle, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Update Vehicle')),
      share());
  }

  addVehicle(vehicle: Vehicle): Observable<any> {
    console.log('Adding vehicle');
    return this.http.post<Vehicle>(this.apiUrl, vehicle, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Add Vehicle')),
      share());
  }

  getVehicleDocuments(vehicle: Vehicle) {
    return this.http.get<Vehicle>(`${this.apiUrl}/${vehicle.id}/documents`, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Get Vehicle Documents', null)),
      share());
  }

  addVehicleDocument(vehicle: Vehicle, title: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('upload', file, file.name);
    formData.append('title', title);
    formData.append('filetype', file.type);
    return this.http.post(`${this.apiUrl}/${vehicle.id}/documents`, formData, this.getGenericRequestOptions()).pipe(
      catchError(this.handleError('Add Vehicle Document')),
      share()
    );
  }

  updateVehicleDocument(vehicle: Vehicle, document) {
    return this.http.put(`${this.apiUrl}/${vehicle.id}/documents/${document.id}}`, document, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Edit Vehicle Document')),
      share()
    );
  }

  deleteDocument(vehicle: Vehicle, documentId) {
    return this.http.delete(`${this.apiUrl}/${vehicle.id}/documents/${documentId}`, this.getJsonRequestOptions()).pipe(
      catchError(this.handleError('Edit Vehicle Document')),
      share()
    );
  }

  generateDownloadUrl(documentId) {
    return `${this.apiUrl}/download/${documentId}`;
  }

  downloadDocument(documentId): Observable<Blob> {
    return this.http.get(this.generateDownloadUrl(documentId), this.getBlobRequestOptions()).pipe(
      catchError(this.handleError('Download Document', null)),
      share()
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.messages.push(`${operation} failed: ${error.message}`);
      throw error;
    };
  }

  private getBlobRequestOptions(): {responseType: 'blob', headers: HttpHeaders} {
    return {
      headers: this.getGenericRequestOptions().headers,
      responseType: 'blob'
    };
  }

  private getJsonRequestOptions(): {headers: HttpHeaders} {
    const headers = this.getGenericRequestOptions();
    headers.headers = headers.headers.append('Content-Type', 'application/json');
    return headers;
  }

  private getMultipartRequestOptions(): {headers: HttpHeaders} {
    const headers = this.getGenericRequestOptions();
    headers.headers = headers.headers.append('enctype', 'multipart/form-data');
    headers.headers = headers.headers.append('Content-Type', 'multipart/form-data');
    return headers;
  }

  private getGenericRequestOptions(): {headers: HttpHeaders} {
    const token = this.auth.getIdToken();
    let headers;
    if (token) {
      headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    } else {
      headers = new HttpHeaders();
    }
    return {headers: headers};
  }
}
