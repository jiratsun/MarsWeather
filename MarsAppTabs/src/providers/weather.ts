import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherInfo } from '../models/weather.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherProvider {
  private nasaMarsTempURL =
    'https://api.nasa.gov/insight_weather/?api_key=rUgeoXepgQG7Ek5XvVsXHGaJSJtc4PwT1rvmiaB1&feedtype=json&ver=1.0';
  constructor(public http: HttpClient) {}

  getMarsWeather() {
    return this.http.get<WeatherInfo>(this.nasaMarsTempURL);
  }
  getDataFromMongo(sol) {
    return this.http.get('https://mars-app-project.herokuapp.com/getDataFromMongo?Sol=' + sol);
  }
  postDataToMongo(url) {
    return this.http.get(url);
  }
  // getHistoryFromMongo(sol) {
  //   return this.http.get('https://mars-app-project.herokuapp.com/getHistoryFromMongo?Sol=' + sol);
  // }
  getMongoSize() {
    return this.http.get('https://mars-app-project.herokuapp.com/getMongoSize');
  }
}
