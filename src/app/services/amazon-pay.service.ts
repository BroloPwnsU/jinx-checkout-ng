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

	waitForLoad(): Observable<boolean> {
		return this.loadingSubject.asObservable();
	}

	getIsLoaded(): boolean {
		return this.isLoaded;
	}

	getSellerId(): string {
		return this.sellerId;
	}

	constructor(private messageService: MessageService) {
		
	}

	ngOnInit(): void {
	}
}
