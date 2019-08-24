import firebaseConfig from "./config"

firebase.initializeApp(firebaseConfig);

var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById("txtPassword");
var btnLogIn = document.getElementById("btnLogin");
var btnSignUp = document.getElementById("btnSignUp");
var btnLogout = document.getElementById("btnLogout");
$(window).load(function() {
    $("#register").hide()  
//add login event
btnLogIn.addEventListener('click', e => {
    //get email and password
    //this isn't working .value is a problem for some reason
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();
    //sign in
    var promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(e => console.log(e.message));
});

// add signup event
btnSignUp.addEventListener('click', e=>{
    //sign up email and password
    //not checking for proper email
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();
    //sign in
    var promise = auth.createUserWithEmailAndPassword(email,pass);
    promise.catch(e=> console.log(e.message));
})
btnLogout.addEventListener('click', e=>{
    firebase.auth().signOut();
})
//add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
        btnLogout.classList.add('hide');
    }
    else {
        console.log('not logged in');
        btnLogout.classList.add('show');
    }
})
});