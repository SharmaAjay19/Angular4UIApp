import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	constructor(private commonDataService: CommonDataService){

	}
	title = 'Home';
	
	ngOnInit(){
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(true);}, 100);
		setTimeout(() => {this.commonDataService.showLoaderEvent.emit(false);}, 3000);
	}
}
