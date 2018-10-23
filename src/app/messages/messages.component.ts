import { Component, OnInit } from '@angular/core';
import {MessageService} from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

	showMessages: boolean = false;

	toggleMessages(): void {
		this.showMessages = (this.showMessages) ? false : true;
	}

	constructor(
		public messageService: MessageService
		)
	{ }

	ngOnInit() {
	}

}
