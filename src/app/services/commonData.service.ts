import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class CommonDataService {
	public userProfile: any;
	public userData: any;
	public isUserAdmin: boolean = false;
	public serviceUrls: any;
	public userUnauthenticatedEvent: EventEmitter<string> = new EventEmitter();
	public dataFetchFailedEvent: EventEmitter<string> = new EventEmitter();
	public dataSaveFailedEvent: EventEmitter<string> = new EventEmitter();
	public userRegisterFailedEvent: EventEmitter<string> = new EventEmitter();
	public showLoaderEvent: EventEmitter<boolean> = new EventEmitter();

	public constructor(public _http: Http){
		this.serviceUrls = {
			AuthenticateUserUrl: "https://backendapi4demo.azurewebsites.net/UserLogin",
			FetchUserDataUrl: "https://backendapi4demo.azurewebsites.net/FetchUserData",
			UserRegisterUrl: "https://backendapi4demo.azurewebsites.net/UserRegister",
			AddUserDataUrl: "https://backendapi4demo.azurewebsites.net/AddUserData"
		};
	}

	public registerUser(username, password){
		var body = {
			"username": username,
			"password": password
		};
		var url = this.serviceUrls.UserRegisterUrl;
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.userProfile = res.json();
		},
		(err) => {
			this.userProfile = null;
			this.userRegisterFailedEvent.emit("Register failed");
		});
	}

	public authenticateUser(username, password){
		var body = {
			"username": username,
			"password": password
		};
		var url = this.serviceUrls.AuthenticateUserUrl;
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.userProfile = res.json();
		},
		(err) => {
			this.userProfile = null;
			this.userUnauthenticatedEvent.emit("Login failed");
		});
	}

	public fetchUserData(){
		var url = this.serviceUrls.FetchUserDataUrl + "/" + this.userProfile.userName;
		this._http.get(url, this.buildHeaders()).subscribe((res: Response) => {
			this.userData = res.json();
		},
		(err) => {
			this.userData = null;
			this.dataFetchFailedEvent.emit("Data fetch failed");
		});
	}

	public addUserData(data){
		var url = this.serviceUrls.AddUserDataUrl;
		var body = {
			"username": this.userProfile.rowKey,
			"DataCol1": data.dataCol1,
			"DataCol2": data.dataCol2
		};
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.userData.rows.push(res.json());
		},
		(err) => {
			this.dataSaveFailedEvent.emit("Save failed");
		});
	}

	public buildHeaders(){
		var serviceHeaders = new Headers();
		serviceHeaders.append("Content-Type", "application/json");
		return new RequestOptions({ headers: serviceHeaders });
	}

}