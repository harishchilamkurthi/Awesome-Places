import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { Place } from "../models/place";
import { Location } from "../models/location";

//ts should know that cordova will be available.
declare var cordova: any;

@Injectable()

export class PlacesService{
  // we do have the same places in models, so we need to import them here.
  private places: Place[] = [];

  constructor(private storage: Storage,
              // private placesService: PlacesService,
              private file: File) { }

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
    const place = this.places[index];
    this.places.splice(index, 1);//updating the array
    //remove the element from storage
    //set will always overwrite the existing values.
    //first i m removing the file and now i m overwriting the index value with set with the latest one(which is empty).
    this.storage.set('places', this.places)
        .then(
          ()=>{ 
                this.removeFile(place);
              }
        )
        .catch(
          err => console.log(err)
        );
  }

  private removeFile(place: Place){
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirectory, currentName)
        .then(
          ()=> console.log('Removed File')
        )
        .catch(
          ()=>{
              console.log('Error removing File');
              this.addPlace(place.title, place.description, place.location, place.imageUrl);//if the file removing is failed, we need to add to  storage again(not deleting from storage).
            }
        );
  }
}