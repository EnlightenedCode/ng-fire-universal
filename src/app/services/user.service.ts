import { Injectable, Inject, forwardRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

import { IProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  avatar: string;
  profile: IProfile;
  userDoc: AngularFirestoreDocument;
  uploadTask: AngularFireUploadTask;
  storageRef: AngularFireStorageReference;
  isUpdating = false;

  constructor(
    @Inject(forwardRef(() => AuthService)) private auth: AuthService,
    private notify: NotifyService,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    if (this.auth.user) {
      this.auth.user.pipe(tap(user => {
        this.avatar = user.photoURL;
        this.profile = user.profile;
      })).subscribe();
    }
  }

  public updateProfile(profile: IProfile) {
    this.isUpdating = true;
    this.userDoc = this.userDoc || this.db.doc(`users/${this.auth.getUserID()}`);
    return this.userDoc.update({ profile })
      .then(() => this.notify.success('Successfully updated your profile'))
      .finally(() => this.isUpdating = false)
      .catch(error => this.notify.error(error));
  }

  public updateAvatar(file: File, fileType: string, imageType: string) {
    const path = `images/avatars/${this.auth.getUserID()}`;
    const customMetadata = { user: this.auth.getUserID() };
    // Only allow .png or .jpg images
    if (fileType !== 'image' || !imageType.match(/^(png|jpeg)$/)) {
      this.notify.warn('Image can be PNG or JPEG');
      return;
    } else if (file.size > 300 * 1024) { // Less than 300KB
      this.notify.warn('Image must be less than 300KB');
      return;
    }
    this.isUpdating = true;
    this.storageRef = this.storage.ref(path);
    this.uploadTask = this.storage.upload(path, file, { customMetadata });
    this.uploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.storageRef.getDownloadURL().subscribe(photoURL => {
          this.userDoc = this.userDoc || this.db.doc(`users/${this.auth.getUserID()}`);
          return this.userDoc.update({ photoURL })
            .then(() => this.notify.success('Successfully updated your avatar'))
            .finally(() => this.isUpdating = false)
            .catch(error => this.notify.error(error));
        });
      })
    ).subscribe();
  }

  // public logActivity() {
  //   this.userDoc = this.db.doc<IUser>(`users/${this.getUserID()}`);
  //   this.userDoc.ref.get()
  //     .then(user => {
  //       if (user.exists) {
  //         this.userDoc.update({ lastActive: new Date() });
  //       }
  //     })
  //     .catch(error => this.notify.error('Error logging user activity', error));
  // }

}
