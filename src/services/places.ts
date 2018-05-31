import { Place } from "../models/place";

export class PlacesService{
  // we do have the same places in models, so we need to import them here.
  private places: Place[] = [];

  addPlace(title: string, 
           description: string, 
           location: Location, 
           imageUrl: string)
           {
            const place = new Place(title, description, location, imageUrl);
            this.places.push(place);
           }

  loadPlaces(){
    return this.places.slice();
  }         
}