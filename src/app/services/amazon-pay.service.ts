import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AmazonPayService  {

	isLoaded: boolean = false;
	sellerId: string = "A3NUQDAIHK2DRR";

	private loadingSubject = new Subject<boolean>();

	setIsLoaded(isLoaded: boolean): void { 
		this.messageService.add("Is loading.");
		this.isLoaded = isLoaded;
		this.loadingSubject.next(isLoaded);
	}

	getIsLoaded(): Observable<boolean> {
		if (this.isLoaded) {
			return new Observable<boolean>((observer) => {
				observer.next(true);
			});
		}
		else
		{
			return this.loadingSubject.asObservable();
		}
	}

	getSellerId(): string {
		return this.sellerId;
	}

	constructor(private messageService: MessageService) {
		
	}

	ngOnInit(): void {
	}
}
