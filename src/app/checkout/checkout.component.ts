import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {MessageService} from '../services/message.service';
import {FulfillmentService} from '../services/fulfillment.service';
import {UserService} from '../services/user.service'; 
import {AmazonPayService} from '../services/amazon-pay.service';
import {OrderService} from '../services/order.service';

import {ShippingMethod} from '../classes/shipping-method';
import {Order} from '../classes/order';


declare var OffAmazonPayments: any;
declare var amazon: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

	popupAmazonPay: boolean = false;

	preLoadComplete: boolean = false;
	
	//Error stuff
	isError: boolean = false;
	errorMessage: string = "";
	defaultCriticalMessage: string = "Checkout has suffered a critical error. Please close the Checkout window and try again.";

	orderReferenceId: string;

	referenceIdSet: boolean = false;
	private referenceIdSubject = new Subject<boolean>();

	addressSelected: boolean = false;
	paymentSelected: boolean = false;
	ratesLoaded: boolean = false;
	ratesError: boolean = false;
	rateSelected: boolean = false;
	showRates: boolean = false;
	rates: ShippingMethod[];

	amazonPayAddressWidgetLoaded: boolean = false;
	amazonPayWalletWidgetLoaded: boolean = false;
	amazonPayLoginButtonLoaded: boolean = false;

	finalOrder: Order;

	private startPage(): void {
		this.grabToken();

		this.preLoadComplete = true;
		this.showAmazonPayWidgets();
	}

	getURLParameter(name, source) {
		return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' +
			'([^&]+?)(&|#|;|$)').exec(source) || [,""])[1].replace(/\+/g,'%20')) || null;
	}

	grabToken(): void {
		if (this.popupAmazonPay) {
			this.messageService.add("Grabbing token from url with ?");
			
			this.userService.setAccessToken(this.route.snapshot.queryParamMap.get('access_token'));

			this.messageService.add(this.userService.getAccessToken());
		}
		else {
			//Fallback to grabbing it via the amazon-provided algorithm
			this.messageService.add("Grabbing token from url with #");

			let accessToken = this.getURLParameter("access_token", location.hash);
			this.userService.setAccessToken(accessToken);

			this.messageService.add(this.userService.getAccessToken());
		}
	}

	showAmazonPayWidgets(): void {
		this.amazonPayService.getIsLoaded().subscribe(
			(isLoaded) => { 
				this.messageService.add("Ch.Com: AmPay Subject Done");
				if(isLoaded) {
					this.showAddressWidget();
					this.showWalletWidget();
				}
			}
		);
	}

	showAddressWidget(): void {
		//Don't re-render the amazon widgets, because it will spawn a new script reference every time.
		if (this.amazonPayAddressWidgetLoaded)
			return;

		new OffAmazonPayments.Widgets.AddressBook({
			sellerId: this.amazonPayService.getSellerId(),

			onOrderReferenceCreate: (orderReference) => { 
				//console.log("Add.Widg.onOrderReferenceCreate: " + orderReference.getAmazonOrderReferenceId());
			},

			onAddressSelect: (orderReference) => {
				this.setAddressSelected();
			},

			design: {
				designMode: 'smartphoneCollapsible'
			},

        	onReady: (orderReference) => {
				this.amazonPayAddressWidgetLoaded = true;
				this.setOrderReferenceId(orderReference.getAmazonOrderReferenceId());
			},

			onError: (error) => {
				this.handleAmazonError(error);
			}
		}).bind("addressBookWidgetDiv");
	}

	showWalletWidget(): void {

		//Don't re-render the amazon widgets, because it will spawn a new script reference every time.
		if (this.amazonPayWalletWidgetLoaded)
			return;

		this.messageService.add("Showing wallet widget.");

		new OffAmazonPayments.Widgets.Wallet({
			sellerId: this.amazonPayService.getSellerId(),

			onPaymentSelect: (orderReference) => {
				this.setPaymentSelected(true);
			},
			
			design: {
				designMode: 'smartphoneCollapsible'
			},
			
			onError: (error) => {
				this.handleAmazonError(error);
			},

			onReady: () => {
				this.amazonPayWalletWidgetLoaded = true;
			}

		}).bind("walletWidgetDiv");
	}

	triggerOrderReferenceIdSubject(isSet: boolean): void { 
		this.messageService.add("Reference ID Subject Set.");
		this.referenceIdSet = isSet;
		this.referenceIdSubject.next(isSet);
	}

	getOrderReferenceIdSet(): Observable<boolean> {
		if (this.referenceIdSet) {
			return new Observable<boolean>((observer) => {
				observer.next(true);
			});
		}
		else
		{
			return this.referenceIdSubject.asObservable();
		}
	}
	
	setOrderReferenceId(refId: string): void {
		this.orderService.setAmazonStuff(refId, this.userService.getAccessToken()).subscribe(
			(order) => {
				//Ref ID is set, now other parts of the process can make their mark.
				this.orderReferenceId = order.orderReferenceId;
				this.triggerOrderReferenceIdSubject(true);
			},
			(error) => {
				this.criticalError(error);
			}
		)
	}

	setAddressSelected(): void {
	
		this.zone.run(() => {
			this.addressSelected = true;
			this.ratesLoaded = false;
			this.rateSelected = false;
			this.showRates = false;
			this.ratesError = false;
		});

		this.getOrderReferenceIdSet().subscribe(
			(isSet) => {
				this.zone.run(() => {
					this.orderService.setShippingAddress().subscribe(
						(order) => {
							if (order != null && order.rates != null && order.rates.length > 0) {
								this.rates = order.rates;
								this.ratesLoaded = true;
								this.showRates = true;
								this.ratesError = false;
							}
							else {
								//No rates returned. What now?
								this.logError("No rates returned.");
								this.showRatesError();
							}
						},
						(error) => {
							//Handle some bullshit.
							this.logError(error.message);
							this.showRatesError();
						}
					);
				});
			}
		);
	}

	showRatesError(): void {
		this.ratesLoaded = false;
		this.rates = null;
		this.ratesError = true;
	}

	setPaymentSelected(isSelected: boolean): void {
		this.zone.run(() => {
			//Doesn't need to do anything crazy. Just need to know that everything is selected before we can commit.
			this.paymentSelected = isSelected;
		});
	}

	selectShippingMethod(method: ShippingMethod): void {
		this.rateSelected = true;
		this.finalOrder = null;
		this.showRates = false;

		//Apply the selected shipping method to the order
		this.orderService.setShippingMethod(method).subscribe(
			(order) => {
				this.finalOrder = order;
			},
			(error) => {
				this.criticalError(error);
			}
		);
	}
	
	changeShippingMethod(): void {
		//Let the user see the rates again so they can choose a new one.
		this.showRates = true;
	}

	confirmOrder(): void {
		//Commit order just asks the server to finalize the order and store it in the permanent location.
		this.orderService.commitOrder().subscribe(
			(order) => {
				if (order != null) {
					//Navigate to the checkout complete route.
					this.router.navigateByUrl('/complete');
				}
				else {
					this.criticalError("Can't confirm order. Order is null");
				}
			},
			(error) => {
				//Should probably do something more than just show an error. Maybe give them another try?
				// Maybe it was just a hiccup.
				this.criticalError(error.message);
			}
		);
	}

	logoutAmazonPay(): void {
		this.zone.run(() => {
			this.userService.logoutAmazonPay();
		});
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

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private zone: NgZone,
		private messageService: MessageService,
		private userService: UserService,
		private amazonPayService: AmazonPayService,
		private fulfillmentService: FulfillmentService,
		private orderService: OrderService
		) { }

	ngOnInit() {
		if (this.userService.getUserAuth() == null)
		{
			this.criticalError("Your session has expired. Please close the checkout and try again.");
		}
		else {
			//Get the order. It may need to be loaded from the server. If it doesn't exist, we have a problem.
			this.orderService.getOrder().subscribe(
				(order) => { this.startPage(); },
				(error) => { this.criticalError("Your session has expired. Please close the checkout and try again."); }
			)
		}
	}
}
