
var pokemonList = [];
var pEntry;

function reqListener () {

    var jsonText = this.responseText;
 	var obj = JSON.parse(jsonText);
 	var imgUrl = "http://pokeapi.co/media/img/" + obj.national_id.toString() + ".png";
    var pokemon = { name: obj.name, type: [] , sprite: imgUrl };
    console.log(pokemon);

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

setTimeout(function(){
    //console.log(pokemonList);
    //modify pokemon list after this
}, 5000);




