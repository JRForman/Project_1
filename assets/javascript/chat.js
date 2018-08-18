// var config = {

//     apiKey: "AIzaSyArnnPCAv1wK6DQXsDw_OoxVS_9OQGQxaU",
//     authDomain: "projectchat-1d35b.firebaseapp.com",
//     databaseURL: "https://projectchat-1d35b.firebaseio.com",
//     projectId: "projectchat-1d35b",
//     storageBucket: "projectchat-1d35b.appspot.com",
//     messagingSenderId: "798394836558"
// };
// firebase.initializeApp(config);

// var database = firebase.database();

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


