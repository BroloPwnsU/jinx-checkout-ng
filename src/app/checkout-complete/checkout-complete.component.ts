import { Component, OnInit } from '@angular/core';

import {SummaryService} from '../services/summary.service';

import {OrderSummary} from '../classes/order-summary';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.css']
})
export class CheckoutCompleteComponent implements OnInit {

	summary: OrderSummary;	

	loadSummary(): void {
		this.summary = this.summaryService.getSummary();
		console.log(this.summary);
	}

	constructor(private summaryService: SummaryService) { }

	ngOnInit() {
		this.loadSummary();
	}

}
