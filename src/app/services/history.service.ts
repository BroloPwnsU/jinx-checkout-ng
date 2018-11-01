import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {MessageService} from './message.service';
import {UserService} from './user.service';
import {AuthHttpClient} from './auth-http-client.service';

import {Order} from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnInit {

    ordersUrl: string = "http://localhost:8112/orders";

    getLast(): Observable<Order> {
        let theUrl: string = `${this.ordersUrl}/get_last_confirmed.json`;

        return this.sendRequest(theUrl, 'getLast');
    }
	
	getOrder(refId: string): Observable<Order> {
        
        let theUrl: string = `${this.ordersUrl}/get_confirmed.json?refId=${refId}`;

        return this.sendRequest(theUrl, 'getOrder');
	}

    getAll(): Observable<Order[]> {
        let theUrl: string = `${this.ordersUrl}/get_history.json`;

        return this.sendListRequest(theUrl, 'getAll');
	}

    private sendRequest(theUrl: string, actionName: string): Observable<Order> {
        return this.authHttp.get<Order>(theUrl).pipe(
            map(e => this.extractDate(e))
            ,catchError(this.handleError(actionName, null))
        );
    }

    private sendListRequest(theUrl: string, actionName: string): Observable<Order[]> {
        return this.authHttp.get<Order[]>(theUrl).pipe(
            map(e => this.extractListDate(e))
            , catchError(this.handleError(actionName, null))
        );
    }

    private extractDate(order: Order): Order {
        this.messageService.add(order.confirmDate);
        order.confirmDateObj = new Date(order.confirmDate);
        return order;
    }

    private extractListDate(orders: Order[]): Order[] {
        orders.forEach((order) => {
            this.messageService.add(order.confirmDate);
            order.confirmDateObj = new Date(order.confirmDate);
        });
        return orders;
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
		this.messageService.add(`HistoryService: ${message}`, true);
	}

	constructor(
        private messageService: MessageService,
        private authHttp: AuthHttpClient
        ) {
    }
    
    ngOnInit(): void {
    }
}
