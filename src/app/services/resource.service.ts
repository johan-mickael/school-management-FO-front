import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient) {

  }

  readonly url: string = environment.apiUrl;

  findAll(resource: string) {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }, mode: 'no-cors',
    }
    return this.httpClient.get(this.url + resource, options);
  }

  findOne(resource: string, id: number) {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }, mode: 'no-cors',
    }
    return this.httpClient.get(this.url + resource + '/' + id, options)
  }

  findByMultipleId(resource: string, id1: number, id2: number) {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }, mode: 'no-cors',
    }
    return this.httpClient.get(this.url + resource + '/' + id1 + '/' + id2, options)
  }

  postData(resource: string, input: any) {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }, mode: 'no-cors',
    }
    return this.httpClient.post(this.url + resource, JSON.stringify(input), options)
  }

  getPromise(observable: Observable<object>) {
    return new Promise<any>((resolve, reject) => {
      observable.subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      );
    })
  }

}
