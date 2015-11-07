var map;
var graphic;
var currLocation;
var watchId;

require([
"esri/map", "esri/geometry/Point", 
"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
"esri/graphic", "esri/Color", "dojo/domReady!"
], function(
Map, Point,
SimpleMarkerSymbol, SimpleLineSymbol,
Graphic, Color
) {
map = new Map("map", {
  basemap: "oceans",
  center: [-85.957, 17.140],
  zoom: 2
});
map.on("load", initFunc);

function initFunc(map) {
  if( navigator.geolocation ) {  
    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    watchId = navigator.geolocation.watchPosition(showLocation, locationError);
  } else {
    alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
  }
}
