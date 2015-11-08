var map;
var graphic;
var currLocation;
var watchId;
var geoLocate;

require([
"esri/map", "esri/geometry/Point", 
"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/layers/GraphicsLayer", "esri/graphic", "esri/Color", "esri/InfoTemplate",
"esri/dijit/LocateButton", "dojo/domReady!"], 

function( Map, Point, SimpleMarkerSymbol, SimpleLineSymbol,GraphicsLayer, Graphic, Color, InfoTemplate, LocateButton) {
map = new Map("mapDiv", {basemap: "topo",center: [-117.3280644, 33.9737055], zoom: 16});

geoLocate = new LocateButton({
        map: map
      }, "LocateButton");
      geoLocate.setScale = false;
      geoLocate.startup();
  
map.on("load", initFunc);

function orientationChanged() {
  if(map){
    map.reposition();
    map.resize();
  }
}

function addPokemon(lon, lat){

    p = new Point(lon, lat );
    s =  new esri.symbol.PictureMarkerSymbol("images/pokeBall.png" , 51 , 51);
    // can add a PictureMarkerSymbol here instead of marker Symbol
    g = new Graphic(p, s);

    // infoTemplate
    var infoTemp = new InfoTemplate();
    infoTemp.setTitle ("Pokemon Name");
    infoTemp.setContent("Pokemon info");
    g.setInfoTemplate(infoTemp.setTitle("Pokemon Name"));

    map.graphics.add(g);


}

function initFunc(evt) {
      
    // var gl = new GraphicsLayer();
  addPokemon(-117.325104, 33.978285 );


  if( navigator.geolocation ) {  
    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    watchId = navigator.geolocation.watchPosition(showLocation, locationError);
  } else {
    alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
  }
}

function locationError(error) {
  //error occurred so stop watchPosition
  if( navigator.geolocation ) {
    navigator.geolocation.clearWatch(watchId);
  }
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Location not provided");
      break;

    case error.POSITION_UNAVAILABLE:
      alert("Current location not available");
      break;

    case error.TIMEOUT:
      alert("Timeout");
      break;

    default:
      alert("unknown error");
      break;
  }
}

    function zoomToLocation(location) {
      var pt = new Point(location.coords.longitude, location.coords.latitude);
      addGraphic(pt);
      map.centerAndZoom(pt, 12);
    }

    function showLocation(location) {
      //zoom to the users location and add a graphic
      var pt = new Point(location.coords.longitude, location.coords.latitude);
      if ( !graphic ) {
        addGraphic(pt);
      } else { // move the graphic if it already exists
        graphic.setGeometry(pt);
      }
      map.centerAt(pt);
    }
    
    function addGraphic(pt){
      var symbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 
        12, 
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([210, 105, 30, 0.5]), 
          8
        ), 
        new Color([210, 105, 30, 0.9])
      );
      graphic = new Graphic(pt, symbol);
      map.graphics.add(graphic);
    }

});
