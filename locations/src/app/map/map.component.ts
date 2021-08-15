import { Component, Input, AfterViewInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

function coordsToLatLng(coords: GeolocationCoordinates): L.LatLng {
  return L.latLng(coords.latitude, coords.longitude);
}

function mapClick$(map: L.Map): Observable<LeafletMouseEvent> {
  return new Observable(observer => {
    const click$ = map.on('click', (event: LeafletMouseEvent) => {
      observer.next(event);
    });

    return () => {
      click$.remove();
    };
  });
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!:L.Map;

  constructor() { }

  recenterSubject = new Subject<LatLngLiteral | null>();
  zoomSubject = new Subject<number>();

  @Input()
  set center(newLatLng: LatLngLiteral | null) {
    if (newLatLng) {
      this.recenterSubject.next(newLatLng);
    }
  }

  @Output()
  reCenter = new Subject<LatLngLiteral>();
  
  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 8
    });
    const tiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    tiles.addTo(this.map);

    this.recenterSubject.subscribe(latlng => {
      this.map.setView(latlng as LatLngLiteral);
    });

    this.zoomSubject.pipe(
    ).subscribe(zoom => {
      this.map.setZoom(zoom);
    });

    mapClick$(this.map).pipe(
      map(event => event.latlng as LatLngLiteral)
    ).subscribe(this.reCenter);

  }
}
