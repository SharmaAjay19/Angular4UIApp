import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import { Router} from '@angular/router';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
	allSubscriptions: ISubscription[] = [];
	loginForm: any = {
		username: "",
		password: ""
	};
	errorMessage: string = "";
	constructor(public commonDataService: CommonDataService,
		public router: Router){
		this.allSubscriptions.push(this.commonDataService.userLoginSuccessEvent.subscribe(res => {
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
		}));
	}
	title = 'Login';
	loggedIn: boolean = true;
	ngOnInit(){
	}

	userLogin(){
		this.commonDataService.loginUser(this.loginForm);
	}

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}
}
