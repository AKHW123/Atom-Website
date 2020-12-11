const clubInput = $("#golf_club_input");
//figure out how to get this into string^
const latestClubAdded = $("#latest_addition");
const addClubToBag = $("#add_to_bag");
const bagContents = $("#output_bag");

var firestore = firebase.firestore();
var databaseDocumentRef;
//const parent = databaseDocumentRef.parent;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function voteSuccess() {
  console.log("club saved!");
}

function generalErrorHandler(error) {
    console.log("Got an error", error);
};

function submitClubToBag() {
    databaseDocumentRef = firestore.doc("golfClubSet/club" + clubInput.val());
    console.log('submitting club: ' + clubInput.val());
    //var name = databaseDocumentRef.id;
    databaseDocumentRef.set(
      {
          clubType : clubInput.val(),
          latest: true
      }
    ).then(voteSuccess).catch(generalErrorHandler);
    var parent = firestore.collection("golfClubSet");
    parent.where("clubType", "!=", clubInput.val()).get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        console.log(doc.ref);
        doc.ref.update({
            latest: false
        })
      })
    });


    console.log(databaseDocumentRef);
}




function getClub(){
  // databaseDocumentRef = firestore.doc("golfClubSet/club" + clubInput.val());
  // databaseDocumentRef.get().then(getLastClub).catch(generalErrorHandler);
  var bag = firestore.collection("golfClubSet");
  var latestClub = bag.where("latest", "==", true).get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      console.log(doc);
      document.getElementById("answer").innerHTML = "Latest Club Added: " + doc.data()['clubType'];
    })
  });

}

function getRealTimeUpdate(){
  databaseDocumentRef.onSnapshot(getLastClub);
}

function displayBag(){
  var parent = firestore.collection("golfClubSet");
  parent.get().then((querySnapshot) => {
    document.getElementById("answer").innerHTML = "Items in Bag:   ";
    querySnapshot.forEach((doc) => {
      var docData = doc.data();
      document.getElementById("answer").innerHTML = document.getElementById("answer").innerHTML + docData['clubType'] + ", ";
    })
      document.getElementById("answer").innerHTML = document.getElementById("answer").innerHTML.substring(0, document.getElementById("answer").innerHTML.length - 2);
  });
}
function emptyBag(){
    firestore.collection("golfClubSet").get().then(res => {
        res.forEach(element => {
            element.ref.delete();
        })
    });
    document.getElementById("answer").innerHTML = "Bag Cleared.";
}

//getRealTimeUpdate();
addClubToBag.click(submitClubToBag);
latestClubAdded.click(getClub);
$("#whole_bag").click(displayBag);
$("#clear_bag").click(emptyBag);
