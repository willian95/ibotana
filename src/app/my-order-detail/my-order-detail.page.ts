import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser/ngx';
import { ProductDetailPage } from '../product-detail/product-detail.page';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-my-order-detail',
  templateUrl: './my-order-detail.page.html',
  styleUrls: ['./my-order-detail.page.scss'],
})
export class MyOrderDetailPage implements OnInit {

  order: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HttpClient,
    public shared: SharedDataService,

    public loading: LoadingService,
    private spinnerDialog: SpinnerDialog, //updates
    private themeableBrowser: ThemeableBrowser, ) {

    this.order = this.shared.myOrderDetialPageData;


    //console.log(this.order);
  }
  getSingleProductDetail(id) {
    this.loading.show();
    this.config.getWoo("products/" + id + "?" + this.config.productsArguments).then((data: any) => {
      this.loading.hide();
      let p = data
      this.shared.singleProductPageData.push(p);
      this.navCtrl.navigateForward("product-detail/" + p.id);
    }, err => {
      this.loading.hide();
      this.shared.showAlert("Item not Available!");
      console.log(err);
    });

    this.shared.addToRecent(id);
  }
  cancelOrder() {


    let orderCreateDate = new Date(this.order.date_created);
    let orderSeconds = orderCreateDate.getTime() / 1000;
    let timeknow = new Date();
    let currentTime = timeknow.getTime() / 1000;

    let timeToCancelOrder = this.config.cancelOrderTime * 3600;
    let timeDiff = (currentTime - orderSeconds)
    //console.log(timeDiff + " " + timeToCancelOrder);
    console.log(timeToCancelOrder - timeDiff);
    let result = timeToCancelOrder - timeDiff;

    if (result < 0) this.shared.toast("Order Cancelation Time Expires!");
    else {

      this.loading.show();
      let dat = {
        status: 'cancelled'
      };
      this.config.putAsync("orders/" + this.order.id, dat).then((data: any) => {
        this.loading.hide();
        this.navCtrl.pop();
        this.shared.toast("Order Cancelled");
      }, err => {
        this.loading.hide();
        this.shared.toast("Server Error");
        console.log(err);
      });

    }
  }
  ionViewDidLoad() {
    this.order = this.shared.myOrderDetialPageData;
  }

  openTrackingPage() {
    let options: ThemeableBrowserOptions = {
      statusbar: {
        color: this.shared.headerHexColor
      },
      toolbar: {
        height: 44,
        color: this.shared.headerHexColor
      },
      closeButton: {
        wwwImage: 'assets/close.png',
        align: 'right',
        event: 'closePressed'
      },
      backButton: {
        wwwImage: 'assets/back.png',
        align: 'left'
        //event: 'closePressed'
      },
      backButtonCanClose: true,
    };
    let id = this.getTrackingId();
    const b: ThemeableBrowserObject = this.themeableBrowser.create(this.config.trackingUrl + "/" + id, '_blank', options);
    let orderPlaced = false;
    b.on('loadstart').subscribe(res => {
      this.spinnerDialog.show("", "", true, { overlayOpacity: 1.00 });
      setTimeout(() => {
        this.spinnerDialog.hide();
      }, 3000);
    });

    b.on('closePressed').subscribe(res => {
      b.close();
    });
    b.on('loadstop').subscribe(res => {
      this.spinnerDialog.hide();
      console.log('loadstop');
    });

  }

  getTrackingId() {
    let id = "";
    for (let v of this.order.meta_data) {
      if (v.key == "_aftership_tracking_number") {
        id = v.value;
      }
    }
    return id;
  }
  addCurrecny(v) {
    return this.order.currency + " " + v;
  }

  ngOnInit() {
  }

}
