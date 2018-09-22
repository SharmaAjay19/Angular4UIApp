import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

	constructor(public commonDataService: CommonDataService){

	}
	title = 'Admin';
	
	ngOnInit(){
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(true);}, 100);
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(false);}, 3000);
	}
}
