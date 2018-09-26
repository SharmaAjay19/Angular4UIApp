import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
	allSubscriptions: ISubscription[] = [];

	constructor(public commonDataService: CommonDataService){

	}
	title = 'Error';
	
	ngOnInit(){
	}

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}
}
