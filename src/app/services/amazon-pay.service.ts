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
		this.messageService.debug("APAY script just finished loading. Triggering observable.");
		this.isLoaded = isLoaded;
		this.loadingSubject.next(isLoaded);
	}

	getIsLoaded(): Observable<boolean> {
		this.messageService.debug("APAY getIsLoaded().");
		if (this.isLoaded) {
			this.messageService.debug("APAY is already loaded.");
			return new Observable<boolean>((observer) => {
				observer.next(true);
			});
		}
		else
		{
			this.messageService.debug("APAY is not loaded yet. Waiting for observable to trigger.");
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
