import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient) {}
  readonly url: string = environment.apiUrl;

  options = {
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
    },  mode: 'no-cors'
  };

  findAll(resource: string) {
    return this.httpClient.get(this.url + resource, this.options);
  }

  findOne(resource: string, id: number) {
    return this.httpClient.get(this.url + resource + '/' + id, this.options)
  }

  findByMultipleId(resource: string, id1: number, id2:number) {
    return this.httpClient.get(this.url + resource + '/' + id1 + '/' + id2, this.options)
  }

  postData(resource: string, input: any) {
    return this.httpClient.post(this.url + resource, JSON.stringify(input), this.options)
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
