import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { LatLngLiteral } from 'leaflet';
import { merge, Observable, Subject } from 'rxjs';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SchoolLocation } from './school-location';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'College Finder';
  location$: Observable<SchoolLocation[]>;
  chooseCurrentLocation: Subject<void> = new Subject();
  chooseSearchRadius: Subject<MatSliderChange> = new Subject();
  chooseCenter: Subject<LatLngLiteral> = new Subject();

  latLng$ = merge(this.chooseCurrentLocation.pipe(
    exhaustMap(() => this.currentPosition$),
    map(position => <LatLngLiteral>{lat: position.coords.latitude, lng: position.coords.longitude})
  ), this.chooseCenter);

  constructor(private apiService: ApiService) {
    this.location$ = this.apiService.location$;
  }

  currentPosition$: Observable<GeolocationPosition> = new Observable(observer => {
    return navigator.geolocation.getCurrentPosition(
      position => {
        observer.next(position);
        observer.complete();
      }, 
      error => observer.error(error))
  });

  ngOnInit() {
    this.latLng$.subscribe(this.apiService.center);

    this.chooseSearchRadius.pipe(
      filter(change => !!change.value),
      map(change => change.value as number),
    ).subscribe(this.apiService.distanceInMiles);
  }
}
