import { Component, Inject, forwardRef } from '@angular/core';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    @Inject(forwardRef(() => UserService)) public user: UserService
  ) { }

}
