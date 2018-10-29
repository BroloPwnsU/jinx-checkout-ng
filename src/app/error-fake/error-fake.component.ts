import { Component, OnInit } from '@angular/core';

import {OrderService} from '../services/order.service';

@Component({
  selector: 'app-error-fake',
  templateUrl: './error-fake.component.html',
  styleUrls: ['./error-fake.component.css']
})
export class ErrorFakeComponent implements OnInit {

  setErrorFake(errorFake: number) : void {
    this.orderService.setErrorFake(errorFake);
  }

  constructor(private orderService: OrderService) { }

  ngOnInit() {
  }

}
