export class OrderErrorState {
    needsAddress = false;
    badAddress = false;
    needsPayment = false;
    badPayment = false;
    temporaryError = false;
    permanentError = false;
    orderComplete = false;
}