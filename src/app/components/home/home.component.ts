import { Component, ViewChild } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import {ISubscription} from 'rxjs/Subscription';
import { } from '@types/googlemaps';
import { v4 as uuid } from 'uuid';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	@ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
	objectKeys = Object.keys;
	allSubscriptions: ISubscription[] = [];
	areaName: string = "";
	marker: google.maps.Marker;
	drawingManager: google.maps.drawing.DrawingManager;
	currentDrawingOverlay: any;
	polygon: any[] = [];
	renderedPolygons: any[] = [];
	newAreaCreation: boolean = false;
	constructor(public commonDataService: CommonDataService){
		this.allSubscriptions.push(this.commonDataService.dataFetchSuccessEvent.subscribe(res => {
			if (res.status){
				setTimeout(() => {
				var mapProp = {
      				center: new google.maps.LatLng(18.5793, 73.8143),
      				zoom: 15
    			};
    			this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    			this.findMe();}, 1000);
			
			}
		}));
	}
	title = 'Home';
	ngOnInit(){
		if (!this.commonDataService.userProfile){
			setTimeout(() => {
				this.commonDataService.redirectToLogin();
			}, 100);
		}
		else{
			this.commonDataService.fetchUserData();
		}
	}

	ngOnDestroy(){
		this.allSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this.allSubscriptions = [];
	}

	showPosition(position) {
    	let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    	this.map.panTo(location);
  	}

	findMe() {
    	if (navigator.geolocation) {
      		navigator.geolocation.getCurrentPosition((position) => {
        	this.showPosition(position);
      	});
    	} 	else {
      	alert("Geolocation is not supported by this browser.");
    	}
  	}

  	drawPolygon() {
  		if (this.drawingManager){
  			this.drawingManager.setMap(null);
  			this.currentDrawingOverlay.setMap(null);
  		}
    	this.drawingManager = new google.maps.drawing.DrawingManager({
    		drawingMode: google.maps.drawing.OverlayType.POLYGON,
    		drawingControl: true,
    		drawingControlOptions: {
    			position: google.maps.ControlPosition.TOP_CENTER,
    			drawingModes: [google.maps.drawing.OverlayType.POLYGON]
    		}
    	});
	    this.drawingManager.setMap(this.map);
    	google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      	// Polygon drawn
      	if (event.type === google.maps.drawing.OverlayType.POLYGON) {
      		this.currentDrawingOverlay = event.overlay;
      		this.polygon = event.overlay.getPath().getArray();
      		this.showSaveAreaBox();
        	//this is the coordinate, you can assign it to a variable or pass into another function.
        	//alert("The area is ready to be saved");
      	}
    	});
  	}

  	showSaveAreaBox(){
  		$('#saveAreaModal').modal('show');
  	}

  	saveArea(){
  		if (this.polygon.length>2 && this.areaName.length>0){
  			var data = {
  				username: this.commonDataService.userProfile.rowKey,
  				id: uuid(),
  				areaName: this.areaName,
  				polygon: JSON.stringify(this.polygon)
  			};
  			this.commonDataService.addUserData(data);
  		}
  	}

  	renderUserAreas(){
  		var bounds = new google.maps.LatLngBounds();
  		this.commonDataService.userData.forEach(area => {
  			var polygon = new google.maps.Polygon();
  			polygon.setMap(this.map);
  			var path = JSON.parse(area.polygon);
  			path.forEach(pos => {
  				bounds.extend(pos);
  			})
  			polygon.setPath(path);
  			this.renderedPolygons.push(polygon);
  		});
  		this.map.fitBounds(bounds);
  	}

  	clearAllPolygons(){
  		this.renderedPolygons.forEach(polyg => {
  			polyg.setMap(null);
  		});
  		this.renderedPolygons = [];
  	}

  	enableNewAreaCreation(){
  		this.clearAllPolygons();
  		this.newAreaCreation = true;
  		this.drawPolygon();
  	}

  	//Not in use code
  	placeMarker(location){
  		//let location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
  		var marker = new google.maps.Marker({
  			position: location,
  			map: this.map,
  			title: 'wow'
  		});
  	}
}
