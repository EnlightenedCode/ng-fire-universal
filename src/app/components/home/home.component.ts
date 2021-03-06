import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  items: Observable<any[]>;

  constructor(
    private db: AngularFirestore
  ) {
    this.items = db.collection('items').valueChanges();
  }

}
