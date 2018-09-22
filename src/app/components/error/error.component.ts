import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

	constructor(public commonDataService: CommonDataService){

	}
	title = 'Error';
	
	ngOnInit(){
	}
}
