var pokemonList = [];
var pEntry;
var map;
var graphic;
var currLocation;
var watchId;

function reqListener () {

  var jsonText = this.responseText;
  var obj = JSON.parse(jsonText);
  var imgUrl = "http://pokeapi.co/media/img/" + obj.national_id.toString() + ".png";
  var pokemon = { name: obj.name, type: [] , sprite: imgUrl };

  for (i = 0; i < obj.types.length; i++) { 
       pokemon.type.push(obj.types[i].name);
  }

  window.pokemonList.push(pokemon);
}

var url = "http://pokeapi.co/api/v1/pokemon/";

for ( i = 1; i <= 25; i++){
  counter = i;
  var urlFull = url + i.toString() + "/";
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", reqListener);
  xhr.open("GET", urlFull);
  // Add your code below!
  xhr.send();
}



require([
"esri/map", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/layers/GraphicsLayer", "esri/graphic", "esri/Color", "esri/InfoTemplate", "esri/dijit/PopupTemplate" ,"dojo/domReady!"], 

function( Map, Point, SimpleMarkerSymbol, SimpleLineSymbol,GraphicsLayer, Graphic, Color, InfoTemplate , PopupTemplate) {
map = new Map("mapDiv", {
basemap: "topo",
center: [-117.3280644, 33.9737055],
zoom: 15
});
  
map.on("load", initFunc);
function orientationChanged() {
  if(map){
    map.reposition();
    map.resize();
  }
}
function addPokemon(lon, lat, pokemon){

    p = new Point(lon, lat );
    s = new esri.symbol.PictureMarkerSymbol("images/pokeBall.png" , 51 , 51);
    g = new Graphic(p, s);

    var title = pokemon.name;
    var type = pokemon.type[0];
    var type2 = pokemon.type[1];

    if( !type2 )
      type2 = "";

    var sprite = pokemon.sprite;

    var infoTemp = new PopupTemplate({
    "title": title, 
    "mediaInfos": [{
    "title": type + " / " +type2 ,
    "caption": "",
    "type": "image",
    "value": {
      "sourceURL": sprite,
      "linkURL": sprite
        }
      }]
    });

  g.setInfoTemplate(infoTemp.setTitle("Pokemon Name"));
  map.graphics.add(g);
}

function initFunc(evt) {

  setTimeout(function(){
  dist = 0.0002;
  startingPoint = 33.975881;
  console.log(pokemonList.length)
  for( i = 0; i< pokemonList.length ; ++i){
    addPokemon(-117.339608, startingPoint, pokemonList[i]  );
    startingPoint -= dist;
  }  }, 4000);




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
