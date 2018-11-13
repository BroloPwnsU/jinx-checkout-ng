import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { OrderItem } from '../classes/order-item';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-order-item-list',
  templateUrl: './order-item-list.component.html',
  styleUrls: ['./order-item-list.component.css']
})
export class OrderItemListComponent implements OnInit {

  order: Order;

  loadItems(): void {
    this.orderService.getOrder().subscribe(
      (order) => {
        this.messageService.debug("Order items loaded.");
        this.order = order;
      }
    );
  }

	getPhotoStub(item: OrderItem): string {
		return `https://www.jinx.com/productimage/${item.productId}/${item.colorId}/1/`;
	}

  constructor(
    private orderService: OrderService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadItems();
  }

}
