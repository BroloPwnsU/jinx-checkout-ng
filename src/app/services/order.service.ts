import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {MessageService} from './message.service';
import {UserService} from './user.service';
import {AuthHttpClient} from './auth-http-client.service';

import {Order} from '../classes/order';
import {OrderItem} from '../classes/order-item';
import {TwitchAuth} from '../classes/twitch-auth';
import { ShippingMethod } from '../classes/shipping-method';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit {

    //CustomizationService provides data for the channel

    order: Order;
    errorFake: number = 0;
    ordersUrl: string = "http://localhost:8112/orders";

    getOrder(): Observable<Order> {
        if (this.order != null) {
            return new Observable<Order>((observer) => {
                observer.next(this.order);
            });
        }
        else {
            return this.loadOrder();
        }
    }

    startOrder(cartString: string): Observable<Order> {
        
        let theUrl: string = `${this.ordersUrl}/start.json?cart=${cartString}`;

        return this.sendRequest(theUrl, 'startOrder');
	}
	
	verifyOrder(): Observable<Order> {
        
        let theUrl: string = `${this.ordersUrl}/verify.json`;

        return this.sendRequest(theUrl, 'verifyOrder');
	}

    commitOrder(): Observable<Order> {
        let theUrl: string = `${this.ordersUrl}/commit.json?guid=${this.order.guid}`;

        return this.sendRequest(theUrl, 'commitOrder');
    }

    setAmazonStuff(refId: string, accessToken: string): Observable<Order> {
        let theUrl: string = `${this.ordersUrl}/set_amz_stuff.json?refId=${refId}&accessToken=${accessToken}`;

        return this.sendRequest(theUrl, 'setAmazonStuff');
    }

    setShippingMethod(shippingMethod: ShippingMethod): Observable<Order> {
        this.logError(`rateGroupId=${shippingMethod.rateGroupId}&methodId=${shippingMethod.methodId}`);
        let theUrl: string = `${this.ordersUrl}/set_shipping.json?rateGroupId=${shippingMethod.rateGroupId}&methodId=${shippingMethod.methodId}`;

        return this.sendRequest(theUrl, 'setShippingMethod');
    }

    setShippingAddress(): Observable<Order> {
        let theUrl: string = `${this.ordersUrl}/set_address.json`;

        return this.sendRequest(theUrl, 'setShippingAddress');
    }

    private loadOrder(): Observable<Order> {
        let theUrl: string = `${this.ordersUrl}/load.json`;

        return this.sendRequest(theUrl, 'loadOrder');
    }

    private sendRequest(theUrl: string, actionName: string): Observable<Order> {
        if (this.errorFake == 0) {
            return this.authHttp.get<Order>(theUrl).pipe(
                tap(order => { this.order = <Order>order; })
                , catchError(this.handleError(actionName, null))
            );
        }
        else if (this.errorFake == 1) {
            return new Observable<Order> ((observer) => {
                observer.next(null);
            });
        }
    }

    setErrorFake(errorFake: number): void {
        this.errorFake = errorFake;
    }

    errorTestMessage: string = "No Error";
    errorTest(errorNumber: number): Observable<any> {
        let theUrl: string = `${this.ordersUrl}/error.json?errornumber=${errorNumber}`;

        return this.authHttp.get<any>(theUrl).pipe(
            tap(errorObj => { this.errorTestMessage = errorObj.message; })
            , catchError(this.handleError('errorTest', null))
        );
    }

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {
     
	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead
	 
	    // TODO: better job of transforming error for user consumption
	    this.logError(`${operation} failed: ${error.message}`);
     
        // Let the app keep running by returning an empty result.
        //return of(result as T);

        //Don't want the app to keep running.
        throw error;
	  };
	}

	private logError(message: string) {
		this.messageService.add(`OrderService: ${message}`, true);
	}

	constructor(
        private userService: UserService,
        private messageService: MessageService,
        private authHttp: AuthHttpClient,
        private http: HttpClient
        ) {
    }
    
    ngOnInit(): void {
        //Whenever this service reloads, attempt to load the order from the server.
        // We store the order on the server so it's not lost when the customer refreshes the page. 
        this.loadOrder();
    }
}
