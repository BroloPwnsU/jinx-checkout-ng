import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {MessageService} from '../message.service';
import {FulfillmentService} from '../fulfillment.service';
import {UserService} from '../user.service'; 
import {AmazonPayService} from '../amazon-pay.service';
import {CartService} from '../cart.service';
import {SummaryService} from '../services/summary.service';

import {ShippingEstimate} from '../shipping-estimate';
import {ShippingMethod} from '../shipping-method';
import {Order} from '../order';


declare var OffAmazonPayments: any;
declare var amazon: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

	popupAmazonPay: boolean = false;

	userToken: string;
	orderReferenceId: string;
	amazonPayLoggedIn: boolean = false;
	paymentSelected: boolean = false;
	readyToConfirm: boolean = false;

	amazonPayAddressWidgetLoaded: boolean = false;
	amazonPayWalletWidgetLoaded: boolean = false;
	amazonPayLoginButtonLoaded: boolean = false;

	shippingEstimate: ShippingEstimate;
	order: Order;


	logoutAmazonPay(): void {
		amazon.Login.logout();

		this.amazonPayLoggedIn = false;
		this.userToken = null;
		this.userService.setAccessToken(null);
		
		document.cookie = "amazon_Login_accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		
		this.zone.run(() => {
			this.router.navigateByUrl('/start');
		});
	}

	getURLParameter(name, source) {
		return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' +
			'([^&]+?)(&|#|;|$)').exec(source) || [,""])[1].replace(/\+/g,'%20')) || null;
	}

	grabToken(): void {

		this.userToken = null;
		if (this.popupAmazonPay) {
			this.messageService.add("Grabbing token from url with ?");
			this.userToken = this.route.snapshot.queryParamMap.get('access_token');
		}
		else {
			//Fallback to grabbing it via the amazon-provided algorithm
			this.messageService.add("Grabbing token from url with #");
			this.userToken = this.getURLParameter("access_token", location.hash);
			this.messageService.add(this.userToken);

			if (typeof this.userToken === 'string' && this.userToken.match(/^Atza/)) {
				alert('storing');
				document.cookie = "amazon_Login_accessToken=" + this.userToken; // + ";secure";
			}
		}

		if (this.userToken != null) {
			this.userService.setAccessToken(this.userToken);
		}
		else {
			this.messageService.add("Grabbing token from storage");
			this.userToken = this.userService.getAccessToken();
		}

		if (this.userToken != null)
		{
			this.amazonPayLoggedIn = true;
		}
		else
		{
			this.amazonPayLoggedIn = false;
		}
	}

	showAmazonPayAfterLoad(): void {

		if (this.amazonPayService.getIsLoaded()) {
			this.messageService.add("Ch.Com: AmPay Already Loaded");
			this.showAmazonPay();
		}
		else {
			this.messageService.add("Ch.Com: AmPay Unloaded");
			let tempMsg = this.messageService;
			this.amazonPayService.waitForLoad().subscribe(
				(isLoaded) => { 
					tempMsg.add("Ch.Com: AmPay Subject Done");
					if(isLoaded) this.showAmazonPay(); 
				}
			);
		}
	}


	showAmazonPay(): void {
		if (!this.amazonPayService.getIsLoaded()) {
			this.messageService.add("Amazon Pay not loaded. Try again.");
			return;
		}

		if (this.amazonPayLoggedIn)
		{
			this.showAddressWidget();
			this.showWalletWidget();
		}
		else
		{
			this.showAmazonPayButton();
		}
	}


	showAmazonPayButton(): void {
		
		//Don't re-render
		if (this.amazonPayLoginButtonLoaded)
			return;

		//Amazon Pay library loaded. Let's create a button and get busy wid it.
		var authRequest; 
		OffAmazonPayments.Button("AmazonPayButton", this.amazonPayService.getSellerId(), { 
			type:  "PwA", 
			color: "DarkGray", 
			size:  "medium", 

			authorization: function() {
				var loginOptions = {
					scope: "payments:widget",
					popup: this.popupAmazonPay
					}; 
				authRequest = amazon.Login.authorize (loginOptions, "checkout");
			},
		    onSignIn: (orderReference) => {
		      var referenceId = orderReference.getAmazonOrderReferenceId();
		 
		      if (!referenceId) {
		        this.messageService.add('referenceId missing');
		      }
		    },
		    onError: (error) => {
		    	alert(error);
		    }
		});

		this.amazonPayLoginButtonLoaded = true;
	}

	setAddressSelected(isSelected: boolean): void {
		
		this.zone.run(() => {

			//this.messageService.add('Ch.Com: Address Selected');

			//Go to the server with the order reference ID, use that ID to grab the address
			// from Amazon, then use the address to calculate shipping methods and tax.

			//Clear out existing estimates before getting new ones to prevent out-of-sync errors.

			this.shippingEstimate = null;
			this.fulfillmentService.getShipping(this.orderReferenceId).subscribe(
				(estimate) => {this.shippingEstimate = estimate;}
			);

		});
	}

	showAddressWidget(): void {

		//this.messageService.add("Showing address widget.");
		
		//Don't re-render the amazon widgets, because it will spawn a new script reference every time.
		if (this.amazonPayAddressWidgetLoaded)
			return;

		new OffAmazonPayments.Widgets.AddressBook({
			sellerId: this.amazonPayService.getSellerId(),

			onOrderReferenceCreate: (orderReference) => { 
			},

			onAddressSelect: (orderReference) => {
				this.setAddressSelected(true);
			},

			design: {
				designMode: 'smartphoneCollapsible'
			},

        	onReady: (orderReference) => {
        		//We might actually want to hold onto the reference ID in the session storage,
        		// just in case of a page refresh. But will re-rendering the page give us a new ID?

            	var orderReferenceId = orderReference.getAmazonOrderReferenceId();
            	this.orderReferenceId = orderReferenceId;
				this.amazonPayAddressWidgetLoaded = true;
			},

			onError: (error) => {
				// Your error handling code.
				// During development you can use the following
				// code to view error messages:
				// console.log(error.getErrorCode() + ': ' + error.getErrorMessage());
				// See "Handling Errors" for more information.
			}
		}).bind("addressBookWidgetDiv");
	}


	setPaymentSelected(isSelected: boolean): void {
		this.zone.run(() => {
			this.paymentSelected = isSelected;
		});
	}

	showWalletWidget(): void {

		//Don't re-render the amazon widgets, because it will spawn a new script reference every time.
		if (this.amazonPayWalletWidgetLoaded)
			return;

		this.messageService.add("Showing wallet widget.");

		new OffAmazonPayments.Widgets.Wallet({
			sellerId: this.amazonPayService.getSellerId(),

			onPaymentSelect: (orderReference) => {
				this.messageService.add('Ch.Com: Payment Selected');
				this.setPaymentSelected(true);
				//this.paymentSelected = true;
			},
			
			design: {
				designMode: 'smartphoneCollapsible'
			},

			onError: function(error) {
				// Your error handling code.
				// During development you can use the following
				// code to view error messages:
				// console.log(error.getErrorCode() + ': ' + error.getErrorMessage());
				// See "Handling Errors" for more information.
			},

			onReady: () => {
				this.amazonPayWalletWidgetLoaded = true;
			}

		}).bind("walletWidgetDiv");
	}

	selectShippingMethod(method: ShippingMethod): void {
		this.zone.run(() => {
			//Apply the selected shipping method to the order
			this.order.setShippingMethod(method);
			this.readyToConfirm = true;
		});
	}

	confirmOrder(): void {
		//Actually place the order.
		//Need to send our order object down to the server with the amazon pay details.

		this.order.orderReferenceId = this.orderReferenceId;

		this.fulfillmentService.saveOrder(this.order).subscribe(
			(orderSummary) => {
				this.summaryService.setSummary(orderSummary);
				this.cartService.clear();
				this.zone.run(() => {
					this.router.navigateByUrl('/complete');
				});
			},
			(error) => {

			}
		);
	}

	initializeOrder(): void {
		//Use the same order that is used by the cart, but reset the checkout-specific fields
		this.order = this.cartService.getCart();
		this.order.resetOrder();
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private zone: NgZone,
		private messageService: MessageService,
		private userService: UserService,
		private amazonPayService: AmazonPayService,
		private fulfillmentService: FulfillmentService,
		private cartService: CartService,
		private summaryService: SummaryService
		) { }

	ngOnInit() {
		this.grabToken();
		this.showAmazonPayAfterLoad();
		this.initializeOrder();
	}
}
