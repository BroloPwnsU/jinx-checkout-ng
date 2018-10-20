import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {Order} from './order';
import {OrderSummary} from './order-summary';
import {ShippingEstimate} from './shipping-estimate';
import {ShippingMethod} from './shipping-method';

import {MessageService} from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FulfillmentService {
	
	private fulfillmentBaseUrl: string = 'api/fulfillment/';  // URL to web api

	getShipping(orderReferenceId: string): Observable<ShippingEstimate> {
		let url = this.fulfillmentBaseUrl + 'shipping';

		return new Observable<ShippingEstimate>((observer) => {

			let sampleResult: ShippingEstimate = new ShippingEstimate();
			sampleResult.orderReferenceId = orderReferenceId;
			sampleResult.methods = [
				{
					price: 3.78,
					tax: 1.41,
					name: "Economy",
					deliveryDays: "7-10 Days",
					dateRange: "11/1/2018 - 11/1/2018",
					id: 101
				},
				{
					price: 5.13,
					tax: 1.95,
					name: "Standard",
					deliveryDays: "5-7 Days",
					dateRange: "11/1/2018 - 11/1/2018",
					id: 102
				},
				{
					price: 10.15,
					tax: 2.87,
					name: "Expedited",
					deliveryDays: "3-4 Days",
					dateRange: "11/1/2018 - 11/1/2018",
					id: 103
				},
				{
					price: 20.47,
					tax: 3.43,
					name: "Overnight",
					deliveryDays: "1 Day",
					dateRange: "11/1/2018 - 11/1/2018",
					id: 104
				}
			];

			observer.next(sampleResult);
		});

		/*
		return this.http.get<ShippingEstimate>(url)
		    .pipe(
		    	tap(shippingEstimate => this.log('fetched shipping'))
		    	, catchError(this.handleError<ShippingEstimate>('getShipping'))
		    );
		    */
	}


	//POST: save a new order to the server
	saveOrder (order: Order): Observable<OrderSummary> {
		

		return new Observable<OrderSummary>((observer) => {

			let sampleResult: OrderSummary = new OrderSummary();
			sampleResult.orderReferenceId = order.orderReferenceId;
			sampleResult.jinxOrderNumber = "A12345819";
			sampleResult.total = order.total;
			sampleResult.estimatedShipDate = "11/1/2018";

			observer.next(sampleResult);
		});

/*
		let orderUrl = this.fulfillmentBaseUrl + "/order";
		return this.http.post<OrderSummary>(orderUrl, order, httpOptions).pipe(
			tap((orderSummary: OrderSummary) => this.log(`added order w/ num=${orderSummary.jinxOrderNumber}`))
		);
*/
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
	    this.log(`${operation} failed: ${error.message}`);
	 
	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

	private log(message: string) {
		this.messageService.add(`FulfillmentService: ${message}`);
	}

	constructor(
		private http: HttpClient,
		private messageService: MessageService
		) 
	{ }
}
