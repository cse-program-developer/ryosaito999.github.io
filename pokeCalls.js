


function reqListener () {
  var jsonText = this.responseText;
  //console.log(jsonText);

  var obj = JSON.parse(jsonText);
  console.log(obj.name);
}

var xhr = new XMLHttpRequest();
xhr.addEventListener("load", reqListener);

xhr.open("GET", "http://pokeapi.co/api/v1/pokemon/1/");
// Add your code below!
xhr.send();
