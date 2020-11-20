function changeSomeHtml(){
  $("#NHL").html("This is a page where I basically post about whatever I want. You can check out what I write and provide links to, or not, it's not that important.");
};
function openGame(){
  $("#game_button").click(requestGameContent)
}
function requestGameContent(){
  $.ajax({url: "game.html", success: loadGameContent});
}
function loadGameContent(result){
  $("#game_content").html(result);
}
function onHover(){
  $("#main_picture").attr('src', 'potato.jpg');
}
function offHover(){
  $("#main_picture").attr('src', 'Hockey.png');
}
$("#main_picture").hover(function(){
  $("#main_picture").attr('src', 'potato.jpg');},
  $("#main_picture").attr('src', 'Hockey.png');}
);

$("#NHL").click(changeSomeHtml);
$("#game_button").click(requestGameContent);
