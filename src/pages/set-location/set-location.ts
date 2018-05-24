import { Component } from '@angular/core';
import { Location } from '../../models/location';
import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;

  constructor(private navParams: NavParams){
    this.location = this.navParams.get('location');
  }
}
