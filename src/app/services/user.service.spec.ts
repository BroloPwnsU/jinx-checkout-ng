import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from './message.service';
import { componentFactoryName } from '@angular/compiler';
import { TwitchAuth } from '../classes/twitch-auth';

var sessionStorage = {
  items: {},
  setItem: (key, val) => { this.items[key] = val; },
  getItem: (key) => { return this.items[key]; }
}

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule]
    , providers: [MessageService]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should build good user Auth Params', () => {
    const service: UserService = TestBed.get(UserService);
    
    let testAuth = new TwitchAuth();
    testAuth.token = 'asdf';
    testAuth.userId = '1234';
    testAuth.channelId = '5678';

    service.userAuth = testAuth;

    expect(service.buildUserAuthParams(true)).toBe(
      '&token=asdf&userid=1234&channelid=5678'
      );
      
    expect(service.buildUserAuthParams(false)).toBe(
      'token=asdf&userid=1234&channelid=5678'
      );
      
    testAuth = new TwitchAuth();
    service.userAuth = testAuth;

    expect(service.buildUserAuthParams(false)).toBe(
      'token=undefined&userid=undefined&channelid=undefined'
      );
  });
});
