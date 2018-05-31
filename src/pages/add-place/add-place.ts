import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from "ionic-angular";
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
// import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileError, Entry } from '@ionic-native/file';


import { SetLocationPage } from '../set-location/set-location';
import { Location } from "../../models/location";
import { PlacesService } from '../../services/places';
// import { Cordova } from '@ionic-native/core';

//cordova variable will be identified at runtime
declare var cordova: any;
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = true;
  imageUrl='';

  constructor(private modalCtrl: ModalController, 
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private file: File
  ){}

  onSubmit(form:NgForm){
    this.placesService.addPlace(
      form.value.title, 
      form.value.description,
      this.location,
      this.imageUrl);

      form.reset();
      this.location = {
        lat: 40.7624324,
        lng: -73.9759827
      };

      this.imageUrl = '';
      this.locationIsSet = false;
  }
  
  onOpenMap(){
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if(data){
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }
  
  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your location...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        location => {
          loader.dismiss();
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;
 
        }
      )
      .catch(
        error => {
          loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Couldnt get your location. Pick manually',
            duration: 2500
          });
          toast.present();
        }
      );
  }

  onTakePhoto(){
    // const options: CameraOptions = {
    //   quality: 100,
    // //   // destinationType: this.camera.DestinationType.DATA_URL,
    // //   encodingType: this.camera.EncodingType.JPEG,
    // //   mediaType: this.camera.MediaType.PICTURE,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   // encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   allowEdit: true,
    //   // correctOrientation: true
    // }
    
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        (imageData:any) => {
          //to extract filename||to replace a part of the path
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
        //   let base64Image = 'data:image/jpeg;base64,' + imageData;
        //  }, (err) => {
        //   // Handle error
        //  });
        //to extract the path
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        console.log("Name, path", currentName,"+", path);
        //cordova has helper classes/directories 
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
        //cordova.file.dataDirectory helper expression gives access to the folder for this app on different platform(ios/android) where the files can be stored permanently.
        .then(
          (data: Entry) => {
            this.imageUrl = data.nativeURL;
            // Camera.cleanup(); //works only with iOS
            this.file.removeFile(path, currentName);
          }
        )
        .catch(
          (err: FileError) => {
            this.imageUrl = '';
            const toast = this.toastCtrl.create({
              message: 'Couldnt save the image. Please try again',
              duration: 2500
            });
            toast.present();
            // Camera.cleanup();//cleans up the temp storage
            this.file.removeFile(path, currentName);
          }
        )
        // const base64Image = 'data:image/jpeg;base64,' + imageData;

        this.imageUrl = imageData;
        }
      )
      .catch(
        err => {
          const toast = this.toastCtrl.create({
            message: 'Couldnt take the image. Please try again',
            duration: 2500
          });
          toast.present();
        }
      );
  }
}