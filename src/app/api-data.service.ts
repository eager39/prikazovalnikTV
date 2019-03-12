import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private actionUrl: string=environment.baseUrl;


  constructor(private http: HttpClient) { }

  public get(api,options?) {
    return this.http.get(this.actionUrl+api,options);
}
public add(data,api,options?) {
  return this.http.post<any>(this.actionUrl+api, data,options);
}

}
