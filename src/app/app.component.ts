import { Component, OnInit, NgZone } from '@angular/core';

import { MessageService } from './services/message.service';
import { AmazonPayService } from './services/amazon-pay.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	title = 'BETA - J!NX Checkout';

	enableAmazonPay(value) {
		//Gotta run this in the zone because it's possible that this event is triggering from native JS
		this.zone.run(() => {
			this.messageService.add("Amazon Pay Loaded: " + value);
			this.amazonPayService.setIsLoaded(value);
		});
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private zone: NgZone,
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
