import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './user.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpClient {

  useHeaders: boolean = false;

  appendAuthParams(authUrl: string): string {
    let authParams: string = this.userService.buildUserAuthParams(false);
    if (authUrl.indexOf("?") > -1) {
      return authUrl + "&" + authParams;
    }
    else {
      return authUrl + "?" + authParams;
    }
  }

  get<T>(url: string): Observable<T> {
    if (this.useHeaders) {
      return <Observable<T>>this.http.get(url,{
        headers: {
          'X-Twitch-Auth-UserId': this.userService.userAuth.userId,
          'X-Twitch-Auth-Token': this.userService.userAuth.token,
          'X-Twitch-Auth-ChannelId': this.userService.userAuth.channelId
        }
      } );
    }
    else {
      let authUrl = this.appendAuthParams(url);
      return <Observable<T>>this.http.get(authUrl);
    }
  }

  post<T>(url: string, data): Observable<T> {
    if (this.useHeaders) {
      return <Observable<T>>this.http.post(url, data, {
        headers: {
          'X-Twitch-Auth-UserId': this.userService.userAuth.userId,
          'X-Twitch-Auth-Token': this.userService.userAuth.token,
          'X-Twitch-Auth-ChannelId': this.userService.userAuth.channelId
        }
      } );
    }
    else {
      let authUrl = this.appendAuthParams(url);
      return <Observable<T>>this.http.post(authUrl, data);
    }
  }

  constructor(
      private http: HttpClient,
      private userService: UserService
      ) {}
}