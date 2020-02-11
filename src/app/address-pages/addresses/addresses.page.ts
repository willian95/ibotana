import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ModalController, NavController, Events } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { LocationDataService } from 'src/providers/location-data/location-data.service';
import { SelectCountryPage } from 'src/app/modals/select-country/select-country.page';
import { SelectZonesPage } from 'src/app/modals/select-zones/select-zones.page';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {
  billing = {
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    email: '',
    phone: ''
  };
  billingCountryName = "";
  billingStateName = "";
  shipping = {
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  };
  shippingCountryName = "";
  shippingStateName = "";
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public config: ConfigService,
    public storage: Storage,
    public events: Events,
    public loading: LoadingService,
    public location: LocationDataService) {

    //when country is selected
    events.subscribe('countryChange', (page, value) => {

      if (page == "shippingUpdate") {
        this.shippingCountryName = value.name;
        this.shipping.country = value.value;
        this.shipping.state = null;
        this.shipping.city = null;
        this.shipping.postcode = null;
        this.shippingStateName = "";

      }
      if (page == "billingUpdate") {
        this.billingCountryName = value.name;
        this.billing.country = value.value;
        this.billing.state = null;
        this.billing.city = null;
        this.billing.postcode = null;
        this.billingStateName = "";
      }
    });

    //state is selected

    events.subscribe('stateChange', (page, value) => {


      if (page == "shippingUpdate") {
        if (value == 'other') {
          console.log(page + value);
          this.shipping.state = 'other';
          this.shippingStateName = "other";
        }

        else {
          this.shipping.state = value.value;
          this.shippingStateName = value.name
        }

      }
      if (page == "billingUpdate") {
        if (value == 'other') {
          this.billing.state = 'other';
          this.billingStateName = "other";
        }

        else {
          this.billing.state = value.value;
          this.billingStateName = value.name;
        }
      }
    });
  }

  updateBillingAddress() {
    this.loading.show();
    var d = {
      billing: this.billing
    };
    this.config.putAsync("customers/" + this.shared.customerData.id, d).then((data: any) => {
      this.loading.hide();
      let dat = data
      this.shared.customerData.billing = dat.billing;
      this.storage.set('customerData', this.shared.customerData);
      this.shared.toast("Billing Address Updated");
    });
  }
  updateShippingAddress() {
    this.loading.show();
    var d = {
      shipping: this.shipping
    };
    this.config.putAsync("customers/" + this.shared.customerData.id, d).then((data: any) => {
      this.loading.hide();
      let dat = data

      this.shared.customerData.shipping = dat.shipping;
      console.log("customer data");
      console.log(this.shared.customerData);
      this.storage.set('customerData', this.shared.customerData);
      this.shared.toast("Shipping Address Updated");
    });
  }
  async selectCountryPage(value) {
    let modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      componentProps: {
        page: value
      }
    });
    return await modal.present();
  }
  async selectZonePage(value) {
    let id = (value == "shippingUpdate") ? this.shipping.country : this.billing.country;

    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: {
        page: value, id: id
      }
    });
    return await modal.present();
  }
  openCart() {
    this.navCtrl.navigateForward("cart");
  }
  ionViewWillEnter() {

    if (this.shared.customerData.id != null) {
      this.shipping = this.shared.customerData.shipping;
      this.shippingCountryName = this.location.getCountryName(this.shared.customerData.shipping.country);
      this.shippingStateName = this.location.getStateName(this.shared.customerData.shipping.country, this.shared.customerData.shipping.state);

      this.billing = this.shared.customerData.billing;
      this.billingCountryName = this.location.getCountryName(this.shared.customerData.billing.country);
      this.billingStateName = this.location.getStateName(this.shared.customerData.billing.country, this.shared.customerData.billing.state);
    }
  }
  ngOnInit() {

  }
}
