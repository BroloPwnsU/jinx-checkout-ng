import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { AmazonPayService } from '../services/amazon-pay.service';
import { TwitchAuth } from '../classes/twitch-auth';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';

declare var OffAmazonPayments: any;
declare var amazon: any;

@Component({
  selector: 'app-checkout-start',
  templateUrl: './checkout-start.component.html',
  styleUrls: ['./checkout-start.component.css']
})
export class CheckoutStartComponent implements OnInit {

	loading: boolean = true;
	isError: boolean = false;
	errorMessage: string = "";
	defaultCriticalMessage: string = "Checkout has suffered a critical error. Please close the Checkout window and try again.";

	showAmazonPayButton(): void {
		this.amazonPayService.getIsLoaded().subscribe(
			(isLoaded) => {
				//Amazon Pay library loaded. Let's create a button and get busy wid it.
				var authRequest; 
				OffAmazonPayments.Button("AmazonPayButton", this.amazonPayService.getSellerId(), { 
					type:  "PwA", 
					color: "DarkGray", 
					size:  "medium", 
		
					authorization: function() { 
						var loginOptions = {
							scope: "profile payments:widget payments:shipping_address", //"payments:widget", 
							popup: false
						}; 
						authRequest = amazon.Login.authorize (loginOptions, "checkout");
					},
					onError: (error) => {
						this.handleAmazonError(error);
					}
				});
			},
			(error) => { 
				this.criticalError("Amazon Pay failed to load."); 
			}
		);
	}

	authAndInitializeOrder(): void {
		//Read the URL params. This should be the first time we read the url of the popup window.
		//Pass those params on to the data layer to auth the user, validate the items, and create an order object.
		let urlUserAuth: TwitchAuth = this.buildUserAuthFromUrl();
		let cartString: string = this.route.snapshot.queryParamMap.get('cart');
		if (urlUserAuth == null || cartString == null) {
			//The url is incomplete. Is there something stored for this user on the server?
			this.orderService.getOrder().subscribe(
				(order) => {
					if (order != null) {
						this.showAmazonPayButton();
						this.loading = false;
					}
					else {
						this.criticalError("Order is empty and URL is incomplete.");
					}
				},
				(error) => {
					this.criticalError("Order is empty and URL is incomplete.");
				}
			);
		}
		else {
			//URL has enough info to create an order.
			this.userService.setUserAuth(urlUserAuth);
			
			let order: Order = null;
			this.orderService.startOrder(cartString).subscribe(
				(validOrder) => {
					if (validOrder != null) {
						//Order is valid. Let's do it. Go to amazon pay now.
						this.loading = false;
						this.showAmazonPayButton();
					}
					else {
						this.criticalError("Order is empty and URL is incomplete.");
					}
				},
				(error) => {
					this.criticalError(error.message);
				}
			);
		}
	}
	
	buildUserAuthFromUrl(): TwitchAuth {
		let userAuth: TwitchAuth = new TwitchAuth();

		userAuth.token = this.route.snapshot.queryParamMap.get('token');
		userAuth.userId = this.route.snapshot.queryParamMap.get('userid');
		userAuth.channelId = this.route.snapshot.queryParamMap.get('channelid');

		return userAuth;
	}
	
	logoutAmazonPay(): void {
		this.zone.run(() => {
			this.userService.logoutAmazonPay();
		});
	}

	errorTest(errorNumber: number): void {
		this.orderService.errorTest(errorNumber).subscribe(
			(dude) => { this.messageService.add(dude.message, false); },
			(error) => { this.criticalError(error.message); }
		);
	}

	log(logMessage: string) {
		this.messageService.add(logMessage, false);
	}

	logError(logMessage: string) {
		this.messageService.add(logMessage, true);
	}

	handleAmazonError(error): void {
		this.zone.run(() => {
			this.criticalError(
				`${error.getErrorCode()} - ${error.getErrorMessage()}`
				);
		});
	}

	criticalError(logMessage: string, displayMessage: string = null): void {
		this.log(logMessage);

		this.isError = true;
		this.errorMessage = (displayMessage != null) ? displayMessage : this.defaultCriticalMessage;
	}

/*
	buildItemListFromUrl(): OrderItem[] {
		let orderItems: OrderItem[] = new OrderItem[1];

		let cartString: string = this.route.snapshot.queryParamMap.get('cart');
		cartString.split(';').forEach(element => {
			let itemPair = element.split(':');
			if (itemPair.length == 2)
			{
				let item: OrderItem = new OrderItem();
				item.itemId = parseInt(itemPair[0]);
				item.count = parseInt(itemPair[1]);

				if (item.itemId != NaN && item.count != NaN)
				{
					orderItems.push(item);
				}
			}
		});

		return orderItems;
	}
*/
	
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private zone: NgZone,
		private messageService: MessageService,
		private amazonPayService: AmazonPayService,
		private userService: UserService,
		private orderService: OrderService
		) { }

	ngOnInit() {
		this.authAndInitializeOrder();
	}

}
