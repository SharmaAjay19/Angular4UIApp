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
	public showLoaderEvent: EventEmitter<boolean> = new EventEmitter();

	public constructor(public _http: Http){
		this.userData = {
			columns: [
			{
				name: "col1"
			},
			{
				name: "col2"
			}
			],
			rows: [
			{
				"col1": "hello",
				"col2": "world"
			}
			]
		};
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

	public buildHeaders(){
		var serviceHeaders = new Headers();
		serviceHeaders.append("Content-Type", "application/json");
		return new RequestOptions({ headers: serviceHeaders });
	}

}