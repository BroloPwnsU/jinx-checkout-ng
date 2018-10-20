import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutStartComponent } from './checkout-start/checkout-start.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutCompleteComponent } from './checkout-complete/checkout-complete.component';
import { ErrorPageMissingComponent } from './error-page-missing/error-page-missing.component';


const routes: Routes = [
	{ path: 'start', component: CheckoutStartComponent },
	{ path: 'checkout', component: CheckoutComponent },
	{ path: 'complete', component: CheckoutCompleteComponent },
	{ path: '', redirectTo: 'start', pathMatch: 'full' },
	{ path: '**', component: ErrorPageMissingComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {
}
