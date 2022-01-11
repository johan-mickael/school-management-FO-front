import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient) { }
  // readonly url: string = 'http://192.168.1.26:8000/api/';
  readonly url: string = 'http://localhost:8000/api/';

  options = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  findAll(resource: string) {
    return this.httpClient.get(this.url + resource);
  }

  findOne(resource: string, id: number) {
    return this.httpClient.get(this.url + resource + '/' + id)
  }

  findByMultipleId(resource: string, id1: number, id2:number) {
    return this.httpClient.get(this.url + resource + '/' + id1 + '/' + id2)
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
