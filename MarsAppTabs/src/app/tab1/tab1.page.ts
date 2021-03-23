import { Component } from '@angular/core';
import { WeatherProvider } from '../../providers/weather';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  splash = true;
  tabBarElement: any;
  aBlockOfWeatherData$;
  usableData;
  uploadString = '';
  solList;
  showThisArr = [];
  hasData = false;
  currentSolInMongo = 0;
  currentSolInNasa = 0;

  slideOpts1 = {
    speed: 300,
    centeredSlides: true
  };

  constructor(
    public weatherProvider: WeatherProvider,
    public http: HttpClient
  ) {
    this.tabBarElement = document.querySelector('ion-tab-bar');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
      this.ionViewDidLoad();
      this.fetchNasaData();
      console.log('this is oninit');
  }

  fetchNasaData() {
    this.aBlockOfWeatherData$ = this.weatherProvider.getMarsWeather();
    this.aBlockOfWeatherData$.subscribe(e => (this.usableData = e));
  }

  checkData() {
    this.showThisArr = [];
    let solDate = '';
    let atmosTemp = '';
    let horizontalWindSpeed = '';
    let atmosPressure = '';
    let windDirection = '';
    let season = '';
    // tslint:disable-next-line: no-string-literal
    this.solList = this.usableData['sol_keys'];
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: forin
    for (const sol in this.solList) {
      solDate = this.solList[sol];
      if (this.currentSolInNasa <= Number(solDate)) {
        this.currentSolInNasa = Number(solDate);
      }
      atmosTemp = this.usableData[this.solList[sol]]['AT']['av'];
      horizontalWindSpeed = this.usableData[this.solList[sol]]['HWS'][
        'av'
      ];
      atmosPressure = this.usableData[this.solList[sol]]['PRE']['av'];
      windDirection = this.usableData[this.solList[sol]]['WD'][
        'most_common'
      ]['compass_point'];
      season = this.usableData[this.solList[sol]]['Season'];
      this.uploadString =
        'https://mars-app-project.herokuapp.com/getDataFromNasa?data=' +
        solDate +
        '|' +
        atmosTemp +
        '|' +
        horizontalWindSpeed +
        '|' +
        atmosPressure +
        '|' +
        windDirection +
        '|' +
        season;
      console.log(this.uploadString);
      // break;
    }
    this.getData();
  }
  postData() {
    console.log('Something new!');
    this.weatherProvider.postDataToMongo(this.uploadString).subscribe(e => {
      console.log(e);
      this.getData();
    });
    console.log('post!');
  }

  getData() {
    // tslint:disable-next-line: forin
    for (let sol in this.solList) {
      let G = this.weatherProvider.getDataFromMongo(this.solList[sol]);
      G.subscribe(e => {
        this.showThisArr.push(e);
      });
    }
    setTimeout(() => {
      this.showThisArr.sort((n1, n2) => {
        if (parseInt(n1.Sol, 10) > parseInt(n2.Sol, 10)) {
          return -1;
        }

        if (parseInt(n1.Sol, 10) < parseInt(n2.Sol, 10)) {
          return 11;
        }

        return 0;
      });
      console.log(this.showThisArr);
      this.currentSolInMongo = Number(this.showThisArr[0]['Sol']);
      if (this.currentSolInNasa > this.currentSolInMongo) {
        this.postData();
      } else {
        console.log('nothing new');
      }
      this.hasData = true;
    }, 2500);
  }

  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
      this.checkData();
    }, 2500);
  }
}
