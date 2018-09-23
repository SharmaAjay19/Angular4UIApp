import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
	loginForm: any = {
		username: "",
		password: ""
	};
	errorMessage: string = "";
	constructor(public commonDataService: CommonDataService,
		public router: Router){
		this.commonDataService.userLoginSuccessEvent.subscribe(res => {
			if (res.status){
				document.getElementById("homepagelink").click();
			}
			else{
				if (res.msg.status===400){
					this.errorMessage = "Invalid password";
				}
				else{
					this.errorMessage = "User does not exist";
				}
			}
		});
	}
	title = 'Login';
	loggedIn: boolean = true;
	ngOnInit(){
	}

	userLogin(){
		console.log(this.loginForm);
		this.commonDataService.loginUser(this.loginForm);
	}
}
