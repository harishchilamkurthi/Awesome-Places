import { Component } from '@angular/core';
import { Location } from '../../models/location';
import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;
  marker: Location;

  constructor(private navParams: NavParams){
    this.location = this.navParams.get('location');
  }

  onSetMarker(event: any){
    console.log(event);
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }
}
