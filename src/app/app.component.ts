import { Component } from '@angular/core';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'monAgence';

  constructor(){
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyAzT7eYqRdFa7WgSRnO6dHqDoUN9up4IiE',
      authDomain: 'monagence-4b8bf.firebaseapp.com',
      databaseURL: 'https://monagence-4b8bf.firebaseio.com',
      projectId: 'monagence-4b8bf',
      storageBucket: 'monagence-4b8bf.appspot.com',
      messagingSenderId: '1075939522229',
      appId: '1:1075939522229:web:38c3d1850aad042daf30fc',
      measurementId: 'G-ECCKLP2WCG'
    };
    firebase.initializeApp(firebaseConfig);
  }
}
