import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class CommonDataService {
	public userProfile: any;
	public userData: any[] = [];
	public rangeQueryData: any[] = [];
	public isUserAdmin: boolean = false;
	public serviceUrls: any;
	public userLoginSuccessEvent: EventEmitter<any> = new EventEmitter();
	public dataFetchSuccessEvent: EventEmitter<any> = new EventEmitter();
	public dataSaveSuccessEvent: EventEmitter<any> = new EventEmitter();
	public userRegisterSuccessEvent: EventEmitter<any> = new EventEmitter();
	public rangeQuerySuccessEvent: EventEmitter<any> = new EventEmitter();
	public showLoaderEvent: EventEmitter<boolean> = new EventEmitter();
	
	public constructor(public _http: Http){
		this.serviceUrls = {
			LoginUserUrl: "https://backendapi4demo.azurewebsites.net/UserLogin",
			UserRegisterUrl: "https://backendapi4demo.azurewebsites.net/UserRegister",
			//AddUserDataUrl: "https://backendapi4demo.azurewebsites.net/AddUserData",
			//FetchUserDataUrl: "https://backendapi4demo.azurewebsites.net/FetchUserData"
			AddUserDataUrl: "https://backendapi4demo.azurewebsites.net/AddUserDataSql",
			FetchUserDataUrl: "https://backendapi4demo.azurewebsites.net/FetchUserDataSql",
			RangeQueryUrl: "https://backendapi4demo.azurewebsites.net/RangeQuerySql",
			DeleteAreaUrl: "https://backendapi4demo.azurewebsites.net/DeleteUserDataSql"
		};
	}

	public rangeQuery(body){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.RangeQueryUrl;
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.rangeQueryData = res.json();
			this.rangeQuerySuccessEvent.emit({status: true});
		},
		(err) => {
			this.rangeQueryData = [];
			this.showLoaderEvent.emit(false);
			this.rangeQuerySuccessEvent.emit({status: false, msg: err});
		});
	}

	public deleteUserData(id){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.DeleteAreaUrl + "/" + id;
		this._http.get(url, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			var idx = this.userData.findIndex(x => x.id === id);
			this.userData.splice(idx, 1);
		},
		(err) => {
			this.showLoaderEvent.emit(false);
		});
	}

	public registerUser(body){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.UserRegisterUrl;
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userRegisterSuccessEvent.emit({status: true});
		},
		(err) => {
			this.userProfile = null;
			this.showLoaderEvent.emit(false);
			this.userRegisterSuccessEvent.emit({status: false, msg: err});
		});
	}

	public loginUser(body){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.LoginUserUrl;
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userProfile = res.json();
			this.userLoginSuccessEvent.emit({status: true});
		},
		(err) => {
			this.showLoaderEvent.emit(false);
			this.userProfile = null;
			this.userLoginSuccessEvent.emit({status: false, msg: err});
		});
	}

	public fetchUserData(){
		setTimeout(() => {
			this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.FetchUserDataUrl + "/" + this.userProfile.rowKey;
		this._http.get(url, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userData = res.json();
			this.dataFetchSuccessEvent.emit({status: true});
		},
		(err) => {
			this.showLoaderEvent.emit(false);
			this.userData = [];
			this.dataFetchSuccessEvent.emit({status: false, msg: err});
		});
		}, 100);
	}

	public addUserData(data){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.AddUserDataUrl;
		this._http.post(url, data, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userData.push(data);
			this.dataSaveSuccessEvent.emit({status: true});
		},
		(err) => {
			this.showLoaderEvent.emit(false);
			this.dataSaveSuccessEvent.emit({status: false, msg: err});
		});
	}

	public redirectToHome(){
		document.getElementById("homepagelink").click();
	}

	public redirectToLogin(){
		document.getElementById("loginpagelink").click();
	}

	public buildHeaders(){
		var serviceHeaders = new Headers();
		serviceHeaders.append("Content-Type", "application/json");
		return new RequestOptions({ headers: serviceHeaders });
	}

}