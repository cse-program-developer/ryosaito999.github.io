var pokemonList = [];
var pEntry;
var map;
var graphic;
var currLocation;
var watchId;
var graphicArr = [];
var pokemonNames = [];

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

for ( i = 1; i <= 150; i++){
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
map = new Map("mapDiv", { basemap: "topo", center: [-117.3280644, 33.9737055], zoom: 16});
  
map.on("load", initFunc);
function orientationChanged() {
  if(map){
    map.reposition();
    map.resize();
  }


  
}
function addPokemon(lon, lat, pokemon){

    var p = new Point(lon, lat );
    var s = new esri.symbol.PictureMarkerSymbol("images/pokeBall.png" , 51 , 51);
    var g = new Graphic(p, s);

    var title = pokemon.name;
    var type = pokemon.type[0];
    var type2 = ""

    if( !pokemon.type[1] )
      type2 = "";

    else
      type2 =  " / " + pokemon.type[1];



    var sprite = pokemon.sprite;

    var infoTemp = new PopupTemplate({
    "title": title, 
    "mediaInfos": [{
    "title": type + type2 ,
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

function populatePokemon(xMin, xMax, yMin,yMax){

  for( y = yMin; y <= yMax; y+= 0.00005){
    x = xMin;
    while(x <= xMax )
      var randX = Math.random() * ( 0.0001 -  0.00006) + 0.00006;
      var randY = Math.random() * ( 0.00001 +  0.00001)- 0.00001;
      //addPokemon(x, y+randY, pokemonList[0]);
      console.log("x: " + x)
      console.log("y: " + y)

      x-= randX;
  }
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function initFunc(evt) {

  setTimeout(function(){
  
  shuffle(pokemonList);

  dist = 0.0002;
  startingPoint = 33.978934;
  console.log(pokemonList.length)
  for( i = 0; i< pokemonList.length ; ++i){
    var randX = Math.random() * ( 0.008 -  0) + -117.3305;
    var randY = Math.random() * ( 0.0002 -  0) + dist;
    addPokemon(randX , startingPoint, pokemonList[i]  );
    startingPoint -= randY;
  }  }, 7000);


    var p = new Point (-117.32623306, 33.97503628);
    var s =  new esri.symbol.PictureMarkerSymbol("images/pokeBall.png" , 51 , 51);
    // can add a PictureMarkerSymbol here instead of marker Symbol
    var g = new Graphic(p, s);

    // infoTemplate
    var infoTemp = new InfoTemplate();
    infoTemp.setTitle ("Pokemon Name");
    infoTemp.setContent("Pokemon info");
    g.setInfoTemplate(infoTemp.setTitle("Pokemon Name"));

    map.graphics.add(g);
    graphicArr.push(g);
    pokemonNames.push('Noname');


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
      alert("You have declined to provide your location. You won't be able to use PokeQuest.");
      break;

    case error.POSITION_UNAVAILABLE:
      alert("Current location not available. You won't be able to use PokeQuest.");
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
      currLocation = pt;
      if ( !graphic ) {
        addGraphic(pt);
        map.centerAt(pt);
      } else { // move the graphic if it already exists
        graphic.setGeometry(pt);
      }

      checkDistance();
      //map.centerAt(pt);
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

function calcDistance(geo1, geo2)
{
    var x = Math.pow((geo1.x - geo2.x), 2);
    var y = Math.pow((geo1.y - geo2.y), 2);

    return Math.sqrt(x + y);
}

// periodically check if user's current location 
function checkDistance()
{
    for (var i = 0; i < graphicArr.length; i++)
    {
        // currLocation = pt;
        
        dist = calcDistance(currLocation, graphicArr[i].geometry);
        console.log("Distance: " + dist);

        if (dist < .005)
        {
            alert("You captured " + pokemonNames[i] + "!"); 
            map.graphics.remove(graphicArr[i]);
            graphicArr.splice(i, 1);
            pokemonNames.splice(i, 1);
        }
    }
}

});
