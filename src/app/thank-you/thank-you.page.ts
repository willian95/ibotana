import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage implements OnInit {


  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
    public events: Events,
  ) {
  }
  openHome() {
    this.events.publish("openHomePage");
  }
  openOrders() { this.navCtrl.navigateRoot("/my-orders"); }

  ngOnInit() {
    this.shared.orderComplete();
  }

}
