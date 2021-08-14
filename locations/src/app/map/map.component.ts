import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

function coordsToLatLng(coords: GeolocationCoordinates): L.LatLng {
  return L.latLng(coords.latitude, coords.longitude);
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!:L.Map;

  constructor() { }

  recenterSubject = new Subject<GeolocationCoordinates>();
  zoomSubject = new Subject<number>();

  @Input()
  set coords(newCoords: GeolocationCoordinates | null) {
    if (newCoords) {
      this.recenterSubject.next(newCoords);
    }
  }

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

    this.recenterSubject.pipe(
      map(coordsToLatLng),
    ).subscribe(latlng => {
      this.map.setView(latlng);
    });

    this.zoomSubject.pipe(
    ).subscribe(zoom => {
      this.map.setZoom(zoom);
    });

  }
}
