import { Component } from '@angular/core';
import {CommonDataService} from './services/commonData.service';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	allSubscriptions: ISubscription[] = [];
	constructor(private commonDataService: CommonDataService){
		this.allSubscriptions.push(this.commonDataService.showLoaderEvent.subscribe(showFlag => {
			this.showLoader = showFlag;
		}));
	}
	showLoader: boolean;

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}
}
