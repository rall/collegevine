import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolLocation } from './school-location';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  findLocationsByDistance(distanceInMiles: number, latlng: { lat: number, lng: number }) {
    return this.http.post<SchoolLocation[]>(`http://localhost:3000/rpc/distances?distance=lt.${distanceInMiles}&order=distance`,
      latlng,
      {
        headers: this.headers
      }
    );
  }
}
