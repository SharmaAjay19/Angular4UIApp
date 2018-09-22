import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

	constructor(private commonDataService: CommonDataService,
		private router: Router){

	}
	title = 'Login';
	loggedIn: boolean = true;
	ngOnInit(){
		console.log("HEllo Login Component");
		if (this.loggedIn){
			this.router.navigate["/Home"];
		}
	}
}
