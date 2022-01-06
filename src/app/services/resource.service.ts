import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient) { }
  // readonly url: string = 'http://192.168.1.26:8000/api/';
  readonly url: string = 'http://localhost:8000/api/';
  findAll(resource: string) {
    return this.httpClient.get(this.url + resource);
  }

  findOne(resource: string, id: number) {
    return this.httpClient.get(this.url + resource + id)
  }
}
