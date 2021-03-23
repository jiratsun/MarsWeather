import { Component } from '@angular/core';
import { WeatherProvider } from '../../providers/weather';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  aBlockOfWeatherData$;
  usableData;
  solList;
  currentSolInMongo = 0;
  currentSolInNasa = 0;
  hasData = false;
  mongoSize = 0;
  history;
  slideOpts3 = {
    direction: 'vertical',
    slidesPerView: 3
  };

  constructor(
    public weatherProvider: WeatherProvider,
    public http: HttpClient
  ) {}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.fetchNasaData();
    this.weatherProvider.getMongoSize().subscribe(e => {
      this.mongoSize = Number(e);
    });
  }

  fetchNasaData() {
    this.aBlockOfWeatherData$ = this.weatherProvider.getMarsWeather();
    this.aBlockOfWeatherData$.subscribe(e => (this.usableData = e));
    setTimeout(() => {
      this.checkData();
    }, 2500);
  }

  checkData() {
    let solDate = '';
    // tslint:disable-next-line: no-string-literal
    this.solList = this.usableData['sol_keys'];
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: forin
    for (const sol in this.solList) {
      solDate = this.solList[sol];
      if (this.currentSolInNasa <= Number(solDate)) {
        this.currentSolInNasa = Number(solDate);
      }
    }
    this.getData();
  }

  getData() {
    // tslint:disable-next-line: forin
    this.history = [];
    console.log('c');
    for (let c = Number(this.solList[6]) - this.mongoSize + 1; c <= Number(this.solList[6]); c++  ) {
      let G = this.weatherProvider.getDataFromMongo(c + '');
      console.log('c');
      console.log(c);
      G.subscribe(e => {
        this.history.push(e);
      });
    }
    setTimeout(() => {
      this.history.sort((n1, n2) => {
        if (parseInt(n1.Sol, 10) > parseInt(n2.Sol, 10)) {
          return -1;
        }

        if (parseInt(n1.Sol, 10) < parseInt(n2.Sol, 10)) {
          return 11;
        }

        return 0;
      });
      this.currentSolInMongo = Number(this.history[0]['Sol']);
      if (this.currentSolInNasa > this.currentSolInMongo) {
      } else {
        console.log('nothing new');
      }
      this.hasData = true;
    }, 2500);

  }
}
