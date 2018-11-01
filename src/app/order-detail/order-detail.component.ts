import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../classes/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  
	@Input() order : Order;

  showOrder: boolean = false;

  toggleShow(): void {
    this.showOrder = !this.showOrder;
  }

  constructor() { }

  ngOnInit() {
  }

}
