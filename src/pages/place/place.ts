import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Place } from '../../models/place';

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  constructor(public navParams: NavParams) {
    this.place = this.navParams.get('place');
  }


}
