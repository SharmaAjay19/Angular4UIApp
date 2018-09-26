import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
	allSubscriptions: ISubscription[] = [];

	constructor(public commonDataService: CommonDataService){

	}
	title = 'Admin';
	
	ngOnInit(){
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(true);}, 100);
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(false);}, 3000);
	}

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}
}
