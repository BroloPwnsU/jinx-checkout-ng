import { Component, OnInit } from '@angular/core';

import {OrderService} from '../services/order.service';

import {Order} from '../classes/order';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.css']
})
export class CheckoutCompleteComponent implements OnInit {

	summaryLoaded: boolean = false;
	summary: Order;	

	loadSummary(): void {
		this.orderService.getOrder().subscribe(
			(order) => {
				this.summary = order; 
				this.summaryLoaded = true;
			}
		)
	}

	closeWindow(): void {
		//Don't do anything right now.
	}

	constructor(private orderService: OrderService) { }

	ngOnInit() {
		this.loadSummary();
	}

}
