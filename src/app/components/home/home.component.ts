import { Component, ViewChild } from '@angular/core';
import {CommonDataService} from '../../services/commonData.service';
import {ISubscription} from 'rxjs/Subscription';
import { } from '@types/googlemaps';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	@ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
	objectKeys = Object.keys;
	userLocation: any = null;
	userLocationMarker: google.maps.Marker;
	allSubscriptions: ISubscription[] = [];
	areaName: string = "";
	marker: google.maps.Marker;
	drawingManager: google.maps.drawing.DrawingManager;
	currentDrawingOverlay: any;
	areaOfOverlay: number = 0;
	polygon: any[] = [];
	renderedPolygons: any[] = [];
	selectedAreas: any[] = [];
	newAreaCreation: boolean = false;
	userOrMarketMode: boolean = true;
	selectedMarketArea: any;
	selectedMarketPolygon: any;
	constructor(public commonDataService: CommonDataService){
		this.allSubscriptions.push(this.commonDataService.dataFetchSuccessEvent.subscribe(res => {
			if (res.status){
				setTimeout(() => {
					var mapProp = {
	      				center: new google.maps.LatLng(18.5793, 73.8143),
	      				zoom: 15
	    			};
	    			this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
	    			this.findMe();
    			}, 1000);
				setTimeout(() => {
					this.placeMarker({lat: this.userLocation.coords.latitude, lng: this.userLocation.coords.longitude});
				}, 1500);
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
      			this.userLocation = position;
        		this.showPosition(position);
      		});
    	}
    	else {
      		alert("Geolocation is not supported by this browser.");
    	}
  	}

  	renderMarketAreas(){
  		if (this.userLocation){
  			this.userOrMarketMode = false;
  			var centre = 'POINT(' + this.userLocation.coords.latitude + " " + this.userLocation.coords.longitude + ')';
  			var radius = 10000000;
  			this.commonDataService.rangeQuery({centre: centre, radius: radius});
  			this.allSubscriptions.push(this.commonDataService.rangeQuerySuccessEvent.subscribe(res => {
  				if (res.status){
  					this.renderAreas(this.commonDataService.rangeQueryData.filter(x => x.username !== this.commonDataService.userProfile.rowKey));
  				}
  			}));
  		} 
  	}

  	renderUserAreas(){
	  	if (!this.userOrMarketMode){
	  		this.userOrMarketMode = true;
	  		this.renderAreas(this.commonDataService.userData);
	  	}
  	}

  	renderAreas(data){
  		this.disableAreaCreation();
  		this.clearAllPolygons();
  		var bounds = new google.maps.LatLngBounds({lat: this.userLocation.coords.latitude, lng: this.userLocation.coords.longitude});
  		data.forEach(area => {
  			var polygon = new google.maps.Polygon();
  			polygon.setMap(this.map);
  			var startInd = "POLYGON ((".length;
  			var endInd = area.polygon.indexOf("))");
  			var path = area.polygon.substr(startInd, endInd-1).split(", ").slice(0, -1).map(x => new Object({lat: parseFloat(x.split(" ")[0]), lng: parseFloat(x.split(" ")[1])}));
  			path.forEach(pos => {
  				bounds.extend(pos);
  			});
  			polygon.setPath(path);
  			google.maps.event.addListener(polygon, 'click', () => {
	  			if (this.userOrMarketMode){
	  				var idx = this.selectedAreas.findIndex(x => x.id === area.id);
	  				if (idx>=0){
	  					polygon.setOptions({strokeWeight: 2.0, fillColor: 'black'});
	  					this.selectedAreas.splice(idx, 1);
	  				}
	  				else{
	  					polygon.setOptions({strokeWeight: 2.0, fillColor: 'green'});
	  					this.selectedAreas.push(area);
	  				}
	  			}
	  			else{
	  				this.selectedMarketArea = area;
	  				this.selectedMarketPolygon = polygon;
	  				document.getElementById("openAreaDetailsPopupButton").click();
	  			}
			});
  			this.renderedPolygons.push({polygon:polygon, id:area.id});
  		});
  		this.map.fitBounds(bounds);
  	}

  	clearAllPolygons(){
  		this.renderedPolygons.forEach(polyg => {
  			polyg.polygon.setMap(null);
  		});
  		this.selectedAreas = [];
  		this.renderedPolygons = [];
  	}

  	clearPolygon(id){
  		var idx = this.renderedPolygons.findIndex(polyg => polyg.id===id);
  		if (idx>=0){
  			this.renderedPolygons[idx].polygon.setMap(null);
  			this.renderedPolygons.splice(idx, 1);
  		}
  	}

  	deleteSelectedAreas(){
  		this.selectedAreas.forEach(area => {
  			this.commonDataService.deleteUserData(area.id);
  			this.clearPolygon(area.id);
  		});
  		this.selectedAreas = [];
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
      		this.areaOfOverlay = this.getArea(this.currentDrawingOverlay);
      		this.showSaveAreaBox();
        	//this is the coordinate, you can assign it to a variable or pass into another function.
        	//alert("The area is ready to be saved");
      	}
    	});
  	}

  	showSaveAreaBox(){
  		document.getElementById("openPopupButton").click();
  	}

  	saveArea(){
  		if (this.polygon.length>2 && this.areaName.length>0){
  			this.polygon.push(this.polygon[0]);
  			var data = {
  				username: this.commonDataService.userProfile.rowKey,
  				id: uuid(),
  				areaName: this.areaName,
  				polygon: "POLYGON ((" + this.polygon.map(x => x.lat() + " " + x.lng()).join(", ") + "))"
  			};
  			this.commonDataService.addUserData(data);
  			this.allSubscriptions.push(this.commonDataService.dataSaveSuccessEvent.subscribe(res => {
  				if (res.status){
  					document.getElementById("saveAreaModalCloseButton").click();
  				}
  			}));
  		}
  	}

  	enableNewAreaCreation(){
  		this.clearAllPolygons();
  		this.newAreaCreation = true;
  		this.drawPolygon();
  	}

  	disableAreaCreation(){
  		this.newAreaCreation = false;
  		if (this.drawingManager)
  			this.drawingManager.setMap(null);
  	}

  	//Extra functions
  	placeMarker(location){
  		//let location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
  		this.userLocationMarker = new google.maps.Marker({
  			position: location,
  			map: this.map,
  			title: 'You are Here!'
  		});
  	}

  	getArea(givenPolygon){
  		return Math.round(google.maps.geometry.spherical.computeArea(givenPolygon.getPath()));
  	}

  	distance(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344; }
		if (unit=="N") { dist = dist * 0.8684; }
		return dist;
	}
}
