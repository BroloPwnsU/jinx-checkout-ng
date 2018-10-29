import {OrderItem} from './order-item';
import {ShippingMethod} from './shipping-method';

export class Order {
	items: OrderItem[] = [];

	orderReferenceId: string;
	accessToken: string;
	guid: string;
	
	subtotal: number = 0;
	shipping: number = 0;
	tax: number = 0;
	discounts: number = 0;
	total: number = 0;
	count: number = 0;

	shippingMethod: ShippingMethod;

	rates: ShippingMethod[];

	resetOrder(): void {
		this.orderReferenceId = null;
		this.accessToken = null;
		this.shippingMethod = null;
		this.shipping = 0;
		this.tax = 0;
		this.discounts = 0;
		this.calculateTotal();
	}

	getCount(order: Order): number {
		return order.items.reduce( (tally, item) => {
			  return tally + (item.count);
			}, 0.0); 
	}

	setShippingMethod(method: ShippingMethod): void {
		this.shippingMethod = method;
		this.shipping = this.shippingMethod.price;
		this.tax = this.shippingMethod.tax;

		this.calculateTotal();
	}

	setShipping(shipping: number): void {
		if (shipping == null || shipping < 0)
			shipping = 0;

		this.shipping = shipping;
		this.calculateTotal();
	}

	setTax(tax: number): void {
		if (tax == null || tax < 0)
			tax = 0;

		this.tax = tax;
		this.calculateTotal();
	}

	setDiscounts(discounts: number): void {
		if (discounts == null || discounts > 0)
			discounts = 0;

		this.discounts = discounts;
		this.calculateTotal();
	}

	calculateSubtotal(): number {
		this.subtotal = this.items.reduce( (tally, item) => {
			  return tally + (item.count * item.price);
			}, 0.0);

		return this.subtotal;
	}

	calculateTotal(): number {
		this.calculateSubtotal();
		
		this.total = this.subtotal + this.shipping + this.tax - this.discounts;

		return this.total;
	}

	populateFromJSON(cartStr: string): void {
		var genericCart = JSON.parse(cartStr);
		if (genericCart == null)
			return;

		if (genericCart.items != null)
			this.items = genericCart.items;

		this.calculateSubtotal();
	}
}