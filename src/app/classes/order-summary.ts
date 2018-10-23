export class OrderSummary {
	
	orderReferenceId: string;
	jinxOrderNumber: string;
	total: number;
	estimatedShipDate: string;


	populateFromJSON(objStr: string): void {
		var genericObj = JSON.parse(objStr);
		this.orderReferenceId = genericObj.orderReferenceId;
		this.jinxOrderNumber = genericObj.jinxOrderNumber;
		this.total = genericObj.total;
		this.estimatedShipDate = genericObj.estimatedShipDate;
	}

}