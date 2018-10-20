import { ShippingMethod } from './shipping-method';
export class ShippingEstimate {
	orderReferenceId: string;
	methods: ShippingMethod[];
} 