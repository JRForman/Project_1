import firebaseConfig from "./config"
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#post").on("click", function () {
    var msgUser = $("#userName").val();
    var msgText = $("#text").val();
    
    database.ref("chat").push({
        //saves new data and replaces data at that location
        userName: msgUser,
        text: msgText
    });
    
    $("#text").val('');

})
var msgIndex = 0;
var rMessage = $("#chatResults");
database.ref("chat").on("child_added", function (childSnapshot) {
// storing the snapshot.val() in a variable for convenience

// console.log("snapshot", childSnapshot.val());
var msg = childSnapshot.val();

var rAppend = $("<div>");
    
var inputName = $("<b>").text(msg.userName);
var inputMessage = $("<a>").text(": "+ msg.text);

// console.log("text message", inputMessage);
// console.log("text message", msg.text);   

if(msgIndex % 2 === 0){
    rAppend.addClass('even');
}else{
    rAppend.addClass('odd');
}

rAppend.append(inputName,inputMessage);
rMessage.append(rAppend);

msgIndex++;

// console.log("#text", msg.Text )
// console.log("#text", msg.Text )
}, function (errorObject) {
console.log("Errors handled: " + errorObject.code);
});


