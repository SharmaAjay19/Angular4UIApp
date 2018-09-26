import { Component } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import { Router} from '@angular/router';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
	allSubscriptions: ISubscription[] = [];
	registerForm: any = {
		username: "",
		password: ""
	};
	errorMessage: string = "";
	constructor(public commonDataService: CommonDataService,
		public router: Router){
		this.allSubscriptions.push(this.commonDataService.userRegisterSuccessEvent.subscribe(res => {
			if (res.status){
				document.getElementById("loginpagelink").click();
			}
			else{
				this.errorMessage = "Username is taken";
			}
		}));

	}
	title = 'Register';
	ngOnInit(){
	}

	userRegister(){
		this.commonDataService.registerUser(this.registerForm);
	}

	resetForm(){
		this.registerForm = {
			username: "",
			password: ""
		};
		this.errorMessage = "";
	}

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}
}