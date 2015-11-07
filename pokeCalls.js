function reqListener () {
  console.log(this.responseText);
}


var xhr = new XMLHttpRequest();
xhr.addEventListener("load", reqListener);
xhr.open("GET", "http://pokeapi.co/api/v1/pokemon/1/");
// Add your code below!
xhr.send();

var jsonResponse = JSON.parse(JSON.stringify(xhr.responseText));
console.log(jsonResponse["weight"]);
