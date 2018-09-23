import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class CommonDataService {
	public userProfile: any;
	public userData: any;
	public isUserAdmin: boolean = false;
	public serviceUrls: any;
	public userLoginSuccessEvent: EventEmitter<any> = new EventEmitter();
	public dataFetchSuccessEvent: EventEmitter<any> = new EventEmitter();
	public dataSaveSuccessEvent: EventEmitter<any> = new EventEmitter();
	public userRegisterSuccessEvent: EventEmitter<any> = new EventEmitter();
	public showLoaderEvent: EventEmitter<boolean> = new EventEmitter();

	public constructor(public _http: Http){
		this.serviceUrls = {
			LoginUserUrl: "https://backendapi4demo.azurewebsites.net/UserLogin",
			FetchUserDataUrl: "https://backendapi4demo.azurewebsites.net/FetchUserData",
			UserRegisterUrl: "https://backendapi4demo.azurewebsites.net/UserRegister",
			AddUserDataUrl: "https://backendapi4demo.azurewebsites.net/AddUserData"
		};
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
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.FetchUserDataUrl + "/" + this.userProfile.rowKey;
		this._http.get(url, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userData = res.json();
			this.dataFetchSuccessEvent.emit({status: true});
		},
		(err) => {
			this.showLoaderEvent.emit(false);
			this.userData = null;
			this.dataFetchSuccessEvent.emit({status: false, msg: err});
		});
	}

	public addUserData(data){
		this.showLoaderEvent.emit(true);
		var url = this.serviceUrls.AddUserDataUrl;
		var body = {
			"username": this.userProfile.rowKey,
			"DataCol1": data.dataCol1,
			"DataCol2": data.dataCol2
		};
		this._http.post(url, body, this.buildHeaders()).subscribe((res: Response) => {
			this.showLoaderEvent.emit(false);
			this.userData.rows.push(res.json());
			this.dataSaveSuccessEvent.emit({status: true});
		},
		(err) => {
			this.showLoaderEvent.emit(false);
			this.dataSaveSuccessEvent.emit({status: false, msg: err});
		});
	}

	public buildHeaders(){
		var serviceHeaders = new Headers();
		serviceHeaders.append("Content-Type", "application/json");
		return new RequestOptions({ headers: serviceHeaders });
	}

}