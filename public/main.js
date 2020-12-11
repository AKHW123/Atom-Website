function changeSomeHtml(){
  $("#NHL").html("This is a page where I basically post about whatever I want. You can check out what I write and provide links to, or not, it's not that important.");
};
function openGame(){
  $("#game_button").click(requestGameContent);
}
function requestGameContent(){
  $.ajax({url: "game.html", success: loadGameContent});
}
function loadGameContent(result){
  $("#game_content").html(result);
}
function onHover(){
  $("#main_picture").attr('src', 'potato.jpg');
  $("#main_picture").attr('height', '716');
  $("#main_picture").attr('width', '1277');
}
function offHover(){
  $("#main_picture").attr('src', 'Hockey.png');
}
// $("#main_picture").hover(function(){
//   $("#main_picture").attr('src', 'potato.jpg');},
//   //$("#main_picture").attr('src', 'Hockey.png');}
// );

var numHides = 0;
var currentlyDisplayed = false;
function parseJSON(){
  if (currentlyDisplayed==false){
    $.getJSON("https://firebasestorage.googleapis.com/v0/b/akseliwebsite.appspot.com/o/news.json?alt=media&token=9fadb255-0c8f-4bfd-876e-9bb7692287be", function(result){
      $.each(result, function(i, field){
        $("#space").append(field["headline"] + " by " + field["author"] + " on " + field["date"] + ": <br></br> " + field["body"] + " <br></br>Likes: " + field["numberOfLikes"] + " <br></br><br></br> ");
        console.log(field);
      });
    });
    currentlyDisplayed = true;
    $("#JSONButtons").append("<button class=\"news_buttons\" id=\"hide" + numHides.toString() + "\" onclick=\"clearJSON()\">Hide News</button>");
  }
}

function clearJSON(){
  document.getElementById('space').innerHTML="";
  var name = "hide" + numHides.toString();
  document.getElementById(name).classList.add('hidden');
  numHides++;
  currentlyDisplayed = false;
}

$("#main_picture").hover(onHover);
$("#main_picture").mouseout(offHover);
$("#hide").click(clearJSON);
$("#news_button").click(parseJSON);
$("#NHL").click(changeSomeHtml);
$("#game_button").click(requestGameContent);

/**
 * Changes XML to JSON
 * Modified version from here: http://davidwalsh.name/convert-xml-json
 * @param {string} xml XML DOM tree
 */
function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
      return text + node.nodeValue;
    }, "");
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

async function getXMLNode(url){
  const response = await fetch(url);
  const xmlString = await response.text();
  var XmlNode = new DOMParser().parseFromString(xmlString, 'text/xml');
  jsonObject = xmlToJson(XmlNode);

  var articleNumber = getRandomInt(0, 29);
  //console.log(jsonObject['rss']['channel']['item'][articleNumber]['link']);
  //"https://cors-anywhere.herokuapp.com/"
  var link = "https://cors-anywhere.herokuapp.com/" + jsonObject['rss']['channel']['item'][articleNumber]['link'];
  console.log(articleNumber);
  console.log(link);
  //document.getElementById("the_real_news").innerHTML = "<iframe src=" + link + ">"
  httpGet("https://cors-anywhere.herokuapp.com/" + jsonObject['rss']['channel']['item'][articleNumber]['link']);
  //document.getElementById("news").innerHTML = window.open(jsonObject['rss']['channel']['item'][0]['link']);
}

function httpGet(theUrl)
{
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            createDiv(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
}

function createDiv(responsetext)
{
    //var _body = document.getElementsByTagName('body')[0];
    //var _div = document.createElement('div');
    //console.log(responsetext);
    //var new_text = responsetext.replace(/https/g, "https://cors-anywhere.herokuapp.com/https");
    document.getElementById("the_real_news").classList.remove("hidden");
    document.getElementById("the_real_news").contentWindow.document.write(responsetext);

    //_div.innerHTML = "<br></br>" + responsetext + "<link href=\"main.css\" rel=\"stylesheet\">" + "<script src=\"https://code.jquery.com/jquery-3.5.1.min.js\" crossorigin=\"anonymous\"></script><script src=\"main.js\"></script>";
    //_body.appendChild(_div);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

clickedOnce = false;

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

var c;
function countNumVisits(){
    var cookie = parseInt(document.cookie);
    if (isNaN(cookie)){
      deleteAllCookies();
      document.cookie = "1";
      cookie = 1;
    }
    if (clickedOnce == false){
      document.getElementById("visits").innerHTML = "You've visited this site " + document.cookie + " time(s)!";
      document.cookie = "" + (cookie+1);
      c = cookie;
      clickedOnce = true;
    }else{
      document.getElementById("visits").innerHTML = "You've visited this site " + c + " time(s)!";
    }

}
