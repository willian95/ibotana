import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ThemeableBrowserOptions, ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { NavController, Events } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  downloads = [];
  httpLoading = true;
  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public config: ConfigService,
    public events: Events,
    private applicationRef: ApplicationRef,
    private themeableBrowser: ThemeableBrowser) {
    this.getDownloads();
  }
  getDownloads() {
    this.httpLoading = true;
    this.loading.show();
    this.config.getWoo("customers/" + this.shared.customerData.id + "/downloads" + "?" + this.config.productsArguments).then((data:any) => {
      this.httpLoading = false;
      this.loading.hide();
      let dat = data
      this.downloads = dat;
      console.log(dat);
      this.applicationRef.tick();
    });
  }

  downloadFile(value) {
    let options: ThemeableBrowserOptions = {};
    this.themeableBrowser.create(value.download_url, '_system', options);
    this.loading.autoHide(1000);
    this.events.publish("openHomePage");
  }

  refreshPage() {
    this.getDownloads();
  }

  ngOnInit() {
  }

}
