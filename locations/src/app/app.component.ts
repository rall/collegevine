import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SchoolLocation } from './school-location';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'College Finder';

  constructor(private apiService: ApiService) {
    
  }

  location$!: Observable<SchoolLocation[]>;

  ngOnInit() {
    this.location$ = this.apiService.findLocationsByDistance(100, {lat: 41.8839513, lng: -74.2886072}).pipe(
      tap(console.log)
    );
  }
}
