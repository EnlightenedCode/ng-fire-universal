import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private seo: SeoService) { }

  ngOnInit() {
    this.seo.setMetaTags({
      title: 'Cart',
      description: 'Cart',
      slug: 'cart'
    });
  }

}
