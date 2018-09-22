import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

	constructor(public commonDataService: CommonDataService,
		public router: Router){

	}
	title = 'Register';
	ngOnInit(){
		console.log("Register Component");
	}
}
