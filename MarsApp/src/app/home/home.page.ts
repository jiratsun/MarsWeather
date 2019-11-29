import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor() {}

  hidevalue = false;

  ngOnInit() {
    setTimeout(x => {
      this.hidevalue = true;
    }, 3000);
  }

}
