import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import {
  ToastController,
  Platform
} from '@ionic/angular';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  map: GoogleMap;
  address: string;


  constructor(
    public toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    this.platform.ready();
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
    });
    this.goToMyLocation();
  }


  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null, 2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      //add a marker
      this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Map is ready!');

          this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            draggable: true,
            position: location.latLng
          })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_DRAG_END)
                .subscribe(() => {

                  let markerlatlong = marker.getPosition();
                  console.log("Dragging marker");
                  console.log(markerlatlong.lat);
                  console.log(markerlatlong.lng);
                  this.address = markerlatlong.lat + "/" + markerlatlong.lng;
                });
            });
        });



      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
          console.log("Click MAP", data);
        }
      );
    })
      .catch(err => {
        //this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }




  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
}
