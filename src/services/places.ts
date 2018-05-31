import { Injectable } from "@angular/core";
import { Place } from "../models/place";
import {Location } from "../models/location";

import { Storage } from '@ionic/storage';

@Injectable()

export class PlacesService{
  // we do have the same places in models, so we need to import them here.
  private places: Place[] = [];

  constructor(private storage: Storage) { }
  addPlace(title: string, 
           description: string, 
           location: Location, 
           imageUrl: string)
           {
            const place = new Place(title, description, location, imageUrl);
            this.places.push(place);
            this.storage.set('places', this.places)
                .then()
                .catch(
                  err => { 
                    //want to remove the last added place, to make sure we are not storing the place which doesnt exist.so splicing, the last added place,and remove this last item.
                    this.places.splice(this.places.indexOf(place), 1);
                  }
                );
           }

  loadPlaces(){
    return this.places.slice();
  }         

  fetchPlaces(){
    this.storage.get('places')
        .then(
          (places: Place[]) => 
            {
              this.places = places != null ? places : []; 
            }
          )
        .catch(
          err => console.log(err)
          );
  }

  deletePlace(index: number){
    this.places.splice(index, 1);
  }
}