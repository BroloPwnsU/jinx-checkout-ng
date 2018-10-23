import { Component, OnInit, NgZone } from '@angular/core';

import { MessageService } from './services/message.service';
import { AmazonPayService } from './services/amazon-pay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'BETA - J!NX Checkout';

	enableAmazonPay(value) {
		// this.zone.run(() => {
		
		this.messageService.add("Amazon Pay Loaded: " + value);
		console.log('enableAmazonPay ' + value);
		
		this.amazonPayService.setIsLoaded(value);

		// });
	}


	constructor(
		public zone: NgZone,
		private messageService: MessageService,
		private amazonPayService: AmazonPayService
		)
	{
	    (<any>window).angularComponentRef = {
	      zone: this.zone, 
	      enableAmazonPay: (value) => this.enableAmazonPay(value), 
	      component: this
	    };
	    this.messageService.add('reference added');
	}

	ngOnInit(): void {
	}
}
