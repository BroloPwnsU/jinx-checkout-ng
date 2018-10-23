import { Injectable } from '@angular/core';

import {MessageService} from './message.service';

import {Order} from '../classes/order';
import {OrderItem} from '../classes/order-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

	cart: Order;
	localStorageKey: string = 'app-cart';

	storeCart(): void {
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.cart));
	}

	loadCart(): void {
		var cartStr = localStorage.getItem(this.localStorageKey);

		this.cart = new Order();
		console.log(cartStr);
		this.messageService.add(cartStr);

		if (cartStr != null && cartStr != 'undefined')
			this.cart.populateFromJSON(cartStr);
	}

	getCart(): Order {
		return this.cart;
	}

	clear(): void {
		this.cart = new Order();
		this.storeCart();
	}

	constructor(private messageService: MessageService) {
		
		this.loadCart();
	}
}
