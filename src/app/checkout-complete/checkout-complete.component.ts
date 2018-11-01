import { Component, OnInit } from '@angular/core';

import { HistoryService } from '../services/history.service';

import {Order} from '../classes/order';

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

	closeWindow(): void {
		//Don't do anything right now.
	}

	constructor(private historyService: HistoryService) { }

	ngOnInit() {
		this.loadHistory();
	}

}
