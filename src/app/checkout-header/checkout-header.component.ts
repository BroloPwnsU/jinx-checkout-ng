import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout-header',
  templateUrl: './checkout-header.component.html',
  styleUrls: ['./checkout-header.component.css']
})
export class CheckoutHeaderComponent implements OnInit {

	logoutAmazonPay(): void {
		this.userService.logoutAmazonPay();
  }
  
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
