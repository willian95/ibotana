import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-categories5',
  templateUrl: './categories5.page.html',
  styleUrls: ['./categories5.page.scss'],
})
export class Categories5Page implements OnInit {

  parent: any;
  name: any;
  categories: any = [];
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.parent = this.activatedRoute.snapshot.paramMap.get('parent');
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    console.log(this.parent);
    console.log(this.name);
  }
  openProducts(id, name) {
    this.router.navigateByUrl("/products/" + id + "/" + name + "/newest");
  }

}

