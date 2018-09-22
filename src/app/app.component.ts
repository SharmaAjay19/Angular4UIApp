import { Component } from '@angular/core';
import {CommonDataService} from './services/commonData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private commonDataService: CommonDataService){
		this.commonDataService.showLoaderEvent.subscribe(showFlag => {
			this.showLoader = showFlag;
		});
	}
	showLoader: boolean;
}
