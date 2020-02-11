import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, IonContent } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-home6',
  templateUrl: './home6.page.html',
  styleUrls: ['./home6.page.scss'],
})
export class Home6Page implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  scrollTopButton = false;//for scroll down fab 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: 2.5,
    spaceBetween: 0
  }
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public shared: SharedDataService,
  ) {

  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  // For FAB Scroll
  onScroll(e) {
    if (e.detail.scrollTop >= 500) {
      this.scrollTopButton = true;
    }
    if (e.detail.scrollTop < 500) {
      this.scrollTopButton = false;
    }
  }
  // For Scroll To Top Content
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
  openProducts(value) {
    this.nav.navigateForward("/products/0/0/" + value);
  }

  openCategoryPage() {
    this.events.publish("openCategoryPage");
  }
  ngOnInit() {
  }

}
