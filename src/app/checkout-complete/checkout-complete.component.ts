import { Component, OnInit } from '@angular/core';

import { HistoryService } from '../services/history.service';

import {Order} from '../classes/order';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.css']
})
export class CheckoutCompleteComponent implements OnInit {

	listLoaded: boolean = false;
	orderList: Order[] = null;

	loadHistory(): void {
		this.historyService.getAll().subscribe(
			(order) => {
				this.orderList = order; 
				this.listLoaded = true;
			}
		)
	}

	logoutAmazonPay(): void {
		this.userService.logoutAmazonPay();
	}

	closeWindow(): void {
		//Don't do anything right now.
	}

	constructor(
		private historyService: HistoryService
		, private userService: UserService
		) { }

	ngOnInit() {
		this.loadHistory();
	}

}
