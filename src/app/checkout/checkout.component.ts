import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {MessageService} from '../services/message.service';
import {UserService} from '../services/user.service'; 
import {AmazonPayService} from '../services/amazon-pay.service';
import {OrderService} from '../services/order.service';

import {ShippingMethod} from '../classes/shipping-method';
import {Order} from '../classes/order';
import {OrderErrorState} from '../classes/order-error-state';


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
	showCheckoutError: boolean = false;
	checkoutErrorMessage: string = "";
	tryAgainMessage: string = "The server encountered a temporary problem. Please try again.";

	showCriticalError: boolean = false;
	criticalErrorMessage: string = "";
	closeCheckoutMessage: string = "Checkout has suffered a critical error. Please close the Checkout window and start over.";

	paymentMissingMessage: string = "Please provide a valid payment method.";
	paymentInvalidMessage: string = "We can not accept your payment method. Please provide a valid payment method and try again.";
	addressMissingMessage: string = "Please provide a valid shipping address.";
	addressInvalidMessage: string = "We can not ship to your address. Please provide a different address and try again.";

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
	placingOrder: boolean = false;

	amazonPayAddressWidgetLoaded: boolean = false;
	amazonPayWalletWidgetLoaded: boolean = false;
	amazonPayLoginButtonLoaded: boolean = false;

	finalOrder: Order;

	private startPage(): void {
		this.grabToken();

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
			amazonOrderReferenceId: this.orderReferenceId,
			onPaymentSelect: (orderReference) => {
				this.setPaymentSelected(true);
			},
			
			design: {
				designMode: 'smartphoneCollapsible'
			},
			
			onError: (error) => {
				this.handleAmazonError(error);
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
		this.zone.run(() => { this.preLoadComplete = true });
		this.messageService.add(refId);
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

					//Don't want to show the wallet until the address is chosen.
					this.showWalletWidget();

					this.orderService.setShippingAddress().subscribe(
						(order) => {
							if (order != null && order.rates != null && order.rates.length > 0) {
								this.rates = order.rates;
								this.ratesLoaded = true;
								this.showRates = true;
								this.ratesError = false;
							}
							else {
								this.showRatesError("No rates returned.");
							}
						},
						(error) => {
							//Handle some bullshit.
							this.showRatesError(error.message);
						}
					);
				});
			}
		);
	}

	showRatesError(logMessage: string): void {
		alert('rates error');
		this.ratesLoaded = false;
		this.rates = null;
		this.ratesError = true;
		this.checkoutError(logMessage, this.addressInvalidMessage);
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
		this.placingOrder = true;

		//Commit order just asks the server to finalize the order and store it in the permanent location.
		this.orderService.commitOrder().subscribe(
			(order) => {
				if (order == null || !order.isError) {
					this.router.navigateByUrl('/complete');
					return;
				}
				
				this.placingOrder = false;

				if (order.errorState == null) {
					//Generic error.
					this.checkoutError("Unspecified error - Null error state: " + order.logMessage);
				}

				//Check order object for errors.
				//It should really 
				if (order.errorState.orderComplete) {
					this.router.navigateByUrl('/complete');
				}
				else if (order.errorState.permanentError) {
					this.criticalError(order.logMessage);
				}
				else if (order.errorState.needsPayment) {
					this.checkoutError(order.logMessage, this.paymentMissingMessage);
				}
				else if (order.errorState.badPayment) {
					this.checkoutError(order.logMessage, this.paymentInvalidMessage);
				}
				else if (order.errorState.needsAddress) {
					this.checkoutError(order.logMessage, this.addressMissingMessage);
				}
				else if (order.errorState.badAddress) {
					this.checkoutError(order.logMessage, this.addressInvalidMessage);
				}
				else if (order.errorState.temporaryError) {
					this.checkoutError(order.logMessage);
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

	handleConstraints(constraintList: number[]) : void {
		//Looks at the list of amazon-provided order constraints to direct the customer on how to fix the problem.
		if (constraintList == null || constraintList.length == 0) {
			this.checkoutError("Constraint list is empty.");
		}
		
        // PaymentMethodNotAllowed = 3,
        // PaymentPlanNotSet = 4,
        // ShippingAddressNotSet = 5
		if (constraintList.indexOf(3) > -1 || constraintList.indexOf(4) > -1) {
			//Need to choose another payment method.
			this.checkoutError("Constraint 5 - Shipping Address", "We can not accept your selected payment method. Please choose a different payment method and try again.");
			this.paymentSelected = false;
		}
		else if (constraintList.indexOf(5) > -1) {
			//Need to choose a shipping address.
			this.checkoutError("Constraint 5 - Shipping Address", "We can not ship to your address. Please choose a different shipping address and try again.");
			this.addressSelected = false;
		}
		else {
			//The other messages shouldn't get here, but whatever.
			this.checkoutError("Unexpected constraint: " + constraintList[0]);
		}
	}

	criticalError(logMessage: string, displayMessage: string = null): void {
		this.log(logMessage);

		this.showCriticalError = true;
		this.criticalErrorMessage = (displayMessage != null) ? displayMessage : this.closeCheckoutMessage;
	}

	checkoutError(logMessage: string, displayMessage: string = null): void {
		this.log(logMessage);

		this.showCheckoutError = true;
		this.checkoutErrorMessage = (displayMessage != null) ? displayMessage : this.tryAgainMessage;
	}

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private zone: NgZone,
		private messageService: MessageService,
		private userService: UserService,
		private amazonPayService: AmazonPayService,
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
				(order) => {
					
					if (order == null || order.statusCode == 1) {
						this.orderService.clear();
						this.router.navigateByUrl('/complete');
						return;
					}

					this.startPage();
				},
				(error) => { this.criticalError("Your session has expired. Please close the checkout and try again."); }
			)
		}
	}
}
