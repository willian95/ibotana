import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';

import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  constructor(
    public shared: SharedDataService,
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HTTP,
    public loading: LoadingService,
     ) {

  }

  //===============================================================================================
  //on click image banners
  bannerClick = function (image) {
    //  console.log(image);
    if (image.type == 'category') {
      this.navCtrl.navigateForward("products/" + image.banners_url + "/0/newest");
    }
    else if (image.type == 'product') {
      this.getSingleProductDetail(parseInt(image.banners_url));
    }
    else {
      this.navCtrl.navigateForward("products/0/0/" + image.type);

    }
  }
  //===============================================================================================
  //getting single product data
  getSingleProductDetail(id) {
    this.loading.show();
    //if (this.type == 'recent' || this.type == 'wishList') {
      
    this.config.getWoo("products/" + id + "?" + this.config.productsArguments).then((data:any) => {
      //this.shared.showAlert("loaded");
      this.loading.hide();
      this.shared.singleProductPageData.push(data);
      this.navCtrl.navigateForward("product-detail/" + data.id);
      this.shared.addToRecent(data);
    }, err => {
      this.loading.hide();
      this.shared.showAlert("Item not Available!");
      console.log(err);
    });
  }
  ngOnInit() { }
}
