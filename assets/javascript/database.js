var config = {
    apiKey: firebaseAPIKey,
    authDomain: "movie-schedule-me.firebaseapp.com",
    databaseURL: "https://movie-schedule-me.firebaseio.com",
    projectId: "movie-schedule-me",
    storageBucket: "movie-schedule-me.appspot.com",
    messagingSenderId: "389239809354"
};
firebase.initializeApp(config);
var database = firebase.database();