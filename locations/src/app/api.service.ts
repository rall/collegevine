import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { combineLatest, Subject } from 'rxjs';
import { map, scan, switchMap, tap } from 'rxjs/operators';
import { SchoolLocation } from './school-location';

type Query = { distanceInMiles: number, latlng: LatLngLiteral }

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  center = new Subject<LatLngLiteral>();
  distanceInMiles = new Subject<number>();

  location$ = combineLatest([
    this.distanceInMiles.pipe(
      map(distanceInMiles => <Query>{ distanceInMiles }),
    ),
    this.center.pipe(
      map(latlng => <Query>{ latlng }),
    ),
  ]).pipe(
    scan((acc, query) => {
      const mergedQuery = { ...query[0], ...query[1] };
      return {...acc, ...mergedQuery }
    }, {} as Query),
    switchMap(query => this.findLocationsByDistance(query)),
  );

  private headers = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  private findLocationsByDistance(query: Query) {
    return this.http.post<SchoolLocation[]>(`http://localhost:3000/rpc/distances?distance=lt.${query.distanceInMiles}&order=distance`,
      query.latlng,
      {
        headers: this.headers
      }
    );
  }
}
