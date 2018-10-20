import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { MessageService } from '../message.service';
import { AmazonPayService } from '../amazon-pay.service';

declare var OffAmazonPayments: any;
declare var amazon: any;

@Component({
  selector: 'app-checkout-start',
  templateUrl: './checkout-start.component.html',
  styleUrls: ['./checkout-start.component.css']
})
export class CheckoutStartComponent implements OnInit {

	@Output() onCheckoutExit = new EventEmitter();
	@Input() amazonPayLoaded: boolean = false;

	exitCheckout(): void {
		this.onCheckoutExit.emit();
	}

	showAmazonPayButton(): void {
		if (!this.amazonPayService.getIsLoaded()) {
			this.messageService.add("Amazon Pay not loaded. Try again.");
			return;
		}

		//Amazon Pay library loaded. Let's create a button and get busy wid it.
		var authRequest; 
		OffAmazonPayments.Button("AmazonPayButton", this.amazonPayService.getSellerId(), { 
			type:  "PwA", 
			color: "DarkGray", 
			size:  "medium", 

			authorization: function() { 
				var loginOptions = {
					scope: "payments:widget", 
					popup: false
				}; 
				authRequest = amazon.Login.authorize (loginOptions, "checkout");
			}
		});
	}
	
	constructor(
		private messageService: MessageService,
		private amazonPayService: AmazonPayService
		) { }

	ngOnInit() {
		this.showAmazonPayButton();
	}

}
