import { Injectable } from '@angular/core';

import {MessageService} from '../message.service';

import {OrderSummary} from '../order-summary';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

	summary: OrderSummary;
	localStorageKey: string = 'app-summary';

	storeSummary(): void {
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.summary));
		console.log(JSON.stringify(this.summary));
	}

	loadSummary(): void {
		var objStr = localStorage.getItem(this.localStorageKey);
		console.log(objStr);

		this.summary = new OrderSummary();
		if (objStr != null && objStr != 'undefined')
			this.summary.populateFromJSON(objStr);

		console.log(this.summary);
	}

	getSummary(): OrderSummary {
		return this.summary;
	}

	setSummary(summary: OrderSummary): void {
		this.summary = summary;
		this.storeSummary();
	}

	clear(): void {
		this.summary = new OrderSummary();
		this.storeSummary();
	}

	constructor(private messageService: MessageService) {		
		this.loadSummary();
	}
}
