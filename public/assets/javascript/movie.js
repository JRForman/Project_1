


var votes;
var votesTime;
var movieTimesJSON;
var votesInOrder;
var movieDateAndZip;
var omdbArray = [];
var showVoteResults = false;
var showTimeResults = false;
var moviesContainer = $("#results");
var votingData = $("#vote");
var winMoviePoster;
var showTimeDisplayArray = [];

// moviesContainer.empty();

database.ref("flags").on("value", function (snapshot) {
    flags = snapshot.val();
    if ((flags.selectedDate !== "none") && (flags.selectedZip !== "none") && (flags.movieVoting === true)) {
        movieDate = flags.selectedDate;
        movieZip = flags.selectedZip;
        getDate(flags.selectedDate, flags.selectedZip)

    }
    if (flags.movieVoting) {
        showVoteResults = true;


    }
    if (flags.timeVoting) {

        voteMovieTimes();
    }
    if (flags.allVotingEnded) {
        allVotingEnded();
    }

});




database.ref("votes").on("value", function (snapshot) {
    votes = snapshot.val();
    if (votes == "empty") {
        // database.ref("votes")
    }

    votesInOrder = [];
    for (var x in votes) {
        votesInOrder.push([x, votes[x]]);
    }

    votesInOrder.sort(function (a, b) {
        return b[1] - a[1];
    });
    var win1P = $("<p>").text(votesInOrder[0][0] + ": " + votesInOrder[0][1] + " votes").css("margin", "auto");
    var win2P = $("<p>").text(votesInOrder[1][0] + ": " + votesInOrder[1][1] + " votes").css("margin", "auto");
    var win3P = $("<p>").text(votesInOrder[2][0] + ": " + votesInOrder[2][1] + " votes").css("margin", "auto");
    votingData.empty();

    if (showVoteResults) {
        if (votesInOrder[0][1] == "0") {
            votingData.append("<p> No voting data yet.</p>")


        } else if (votesInOrder[1][1] == "0") {
            votingData.append(win1P);
            var winningMovie = votesInOrder[0][0];
            database.ref().update({
                "winningMovie": winningMovie
            });

        } else if (votesInOrder[2][1] == "0") {
            votingData.append(win1P, win2P);
            var winningMovie = votesInOrder[0][0];
            database.ref().update({
                "winningMovie": winningMovie
            });

        } else {
            votingData.append(win1P, win2P, win3P);
            var winningMovie = votesInOrder[0][0];
            database.ref().update({
                "winningMovie": winningMovie
            });
        }
        var clearVotesBtn = $("<button>").text("Clear Votes").attr("id", "clearVotesBtn");
        var endVotingBtn = $("<button>").text("End Voting").attr("id", "endMovieVotingBtn");
        votingData.append(clearVotesBtn);
        votingData.append(endVotingBtn);
    }
});

database.ref("votesTime").on("value", function (snapshot) {
    votesTime = snapshot.val();

    if (votesTime == "empty") {
        // database.ref("votes")
    }

    votesInOrder = [];
    for (var x in votesTime) {
        votesInOrder.push([x, votesTime[x]]);
    }

    votesInOrder.sort(function (a, b) {
        return b[1] - a[1];
    });
    var win1P = $("<p>").text(votesInOrder[0][0] + ": " + votesInOrder[0][1] + " votes").css("margin", "auto");
    var win2P = $("<p>").text(votesInOrder[1][0] + ": " + votesInOrder[1][1] + " votes").css("margin", "auto");
    var win3P = $("<p>").text(votesInOrder[2][0] + ": " + votesInOrder[2][1] + " votes").css("margin", "auto");
    votingData.empty();

    if (showTimeResults) {
        if (votesInOrder[0][1] == "0") {
            votingData.append("<p> No voting data yet.</p>")


        } else if (votesInOrder[1][1] == "0") {
            votingData.append(win1P);
            var winningTime = votesInOrder[0][0];
            database.ref().update({
                "winningTime": winningTime
            });

        } else if (votesInOrder[2][1] == "0") {
            votingData.append(win1P, win2P);
            var winningTime = votesInOrder[0][0];
            database.ref().update({
                "winningTime": winningTime
            });

        } else {
            votingData.append(win1P, win2P, win3P);
            var winningTime = votesInOrder[0][0];
            database.ref().update({
                "winningTime": winningTime
            });
        }
        var clearTimeVotesBtn = $("<button>").text("Clear Votes").attr("id", "clearTimeVotesBtn");
        var endTimeVotingBtn = $("<button>").text("End Voting").attr("id", "endTimeVotingBtn");
        votingData.append(clearTimeVotesBtn);
        votingData.append(endTimeVotingBtn);



    }
});


// var movieZip = 85204; //! Get from google API

//! Testing
// var movieDate = moment().format("YYYY-MM-DD"); 
// var movieDate = "2017-07-19";
// var movieDate = "2018-07-19";
// var movieDate = "2018-07-20" ;

// getDate(movieDate, movieZip);
// populateMovies();
// startMovie();

function startMovie() {
    moviesContainer.empty();
    // console.log("startingMovie");
    database.ref("flags").update({
        "movieVoting": false,
        "timeVoting": false,
        "allVotingEnded": false
    });
    database.ref("votesTime").set({
        "No votes yet 1": "0",
        "No votes yet 2": "0",
        "No votes yet 3": "0"
    });
    database.ref("votes").set({
        "No votes yet 1": "0",
        "No votes yet 2": "0",
        "No votes yet 3": "0"
    });
    // <p>Date: <input type="text" id="datepicker"></p>
    // $('#movies').click('shown.bs.modal', function () {
    //     $('#myModal').trigger('<br>Movie Date: <input class="datepicker_recurring_start" id="getDate"/>');
    //     $('#myModal').trigger('<br>Zip-Code: <input id="getZip"/>') //.attr("value", zipcode);
    //   })
    moviesContainer.append('<br>Movie Date: <input class="datepicker_recurring_start" id="getDate"/>');
    moviesContainer.append('<br>Zip-Code: <input id="getZip"/>') //.attr("value", zipcode);
    document.getElementById("getZip").defaultValue = zipcode;
    moviesContainer.append('<button id= "submitDateAndZip">Submit</button>');
    $(moviesContainer).on('focus', ".datepicker_recurring_start", function () {
        $(this).datepicker();
    });
}

function getDate(movieDate, movieZip) {
    movieDateAndZip = movieDate + '_' + movieZip;

    database.ref("movieTimes").once("value", function (snapshot) {
        if (snapshot.hasChild(movieDateAndZip)) {
            console.log("Date in database");

        } else {
            var movieLookupURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDate + "&zip=" + movieZip + "&api_key=" + gracenoteAPIKey
            console.log("Retrieving Times for " + movieDate + " Zip: " + movieZip);

            $.ajax({
                url: movieLookupURL,
                method: "GET"
            }).then(function (response) {
                // console.log(response);
                var movieTimes = JSON.stringify(response)

                database.ref("movieTimes").update({

                    [movieDateAndZip]: movieTimes
                });
                for (x in response) {
                    let movieName = response[x].title;
                    if (movieName.endsWith("3D")) {
                        // console.log("3D detected");
                    }

                }
            });
            console.log("Date not in database");
        }



    });
    populateMovies();
}



function populateMovies() {
    moviesContainer.empty();
    database.ref("movieTimes").once("value", function (snapshot) {
        // console.log(snapshot.val())
        showVoteResults = true;

        movieTimesJSON = JSON.parse(snapshot.child(movieDateAndZip).val());
        // console.log(movieTimesJSON);

        for (x in movieTimesJSON) {
            let movieNameResponse = movieTimesJSON[x].title;
            let movieID = movieTimesJSON[x].tmsId;
            if (movieNameResponse.endsWith("3D")) {
                movieName = movieNameResponse.slice(0, movieNameResponse.length - 3)
            } else {
                movieName = movieNameResponse;
            }
            var movieInfoLookupURL = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbAPIKey + "&language=en-US&query=" + movieName


            $.ajax({
                url: movieInfoLookupURL,
                method: "GET"
            }).then(function (omdbResponse) {
                // console.log(omdbResponse);

                if (omdbResponse.results.length == 0) {
                    console.log("no results for:" + movieName);
                } else {
                    movieImgURL = "https://image.tmdb.org/t/p/original" + omdbResponse.results[0].poster_path;
                    var movieContainer = $("<div>");
                    movieContainer.css("width", "14%").css("display", "inline-block");
                    var movieImg = $("<img>").attr("src", movieImgURL).addClass("poster").css("width", "90%").attr("id", movieID).attr("name", movieNameResponse).attr("vote", "false");
                    movieNameP = $("<p>").text(movieNameResponse);

                    var checkMark = $("<img>").attr("src", "assets/images/checkmark.png").css("z-index", "99").css("text-align", "center").css("width", "10%").css("position", "absolute").css("transform", "translate(-100%, 10%)").attr("id", movieID + "check").css("display", "none");

                    omdbArray.push({
                        "Name": movieNameResponse,
                        "URL": movieImgURL

                    });

                    movieContainer.append(movieImg);
                    // movieContainer.append(movieNameP);
                    movieContainer.append(checkMark);

                    moviesContainer.append(movieContainer);
                }
            });
        }
        setTimeout(function () {
            omdbArrayStringified = JSON.stringify(omdbArray);

            database.ref().update({
                "posterURLs": omdbArrayStringified
            });
        }, 3000);



    });

}

function voteMovieTimes() {
    showVoteResults = false;
    showTimeResults = true;

    database.ref().once("value", function (snapshot) {
        movieDateAndZip = (snapshot.child("flags").val()).selectedDate + "_" + (snapshot.child("flags").val()).selectedZip;
        temp = snapshot.child("movieTimes").val()

        movieTimesJSON = JSON.parse(temp[movieDateAndZip]);

        winMovie = snapshot.child("winningMovie").val()
        if (winMovie == "No votes yet 1") {
            return;
        }
        var index = movieTimesJSON.findIndex(obj => obj.title == winMovie);

        var movieID = movieTimesJSON[index].tmsId;
        var showTimes = movieTimesJSON[index].showtimes;
        posterIndexs = JSON.parse(snapshot.child("posterURLs").val());
        var posterIndex = posterIndexs.findIndex(obj => obj.Name == winMovie);
        var posterURL = posterIndexs[posterIndex].URL;
        winMoviePoster = posterURL;

        var childArray = [];
        var storeTheatre;
        var ticketsURL;
        for (x in showTimes) {
            if (x == 0) {
                storeTheatre = showTimes[x].theatre.name;
                ticketsURL = showTimes[x].ticketURI;
                childArray.push((showTimes[x].dateTime).slice(11, 16));
            } else if (showTimes[x].theatre.id === showTimes[x - 1].theatre.id) {
                childArray.push((showTimes[x].dateTime).slice(11, 16));
            } else if (showTimes[x].theatre.id !== showTimes[x - 1].theatre.id) {
                showTimeDisplayArray.push({
                    "theatre": storeTheatre,
                    "id": showTimes[x].theatre.id,
                    "getTickets": ticketsURL,
                    "times": childArray
                })

                storeTheatre = showTimes[x].theatre.name
                ticketsURL = showTimes[x].ticketURI;
                childArray = [];
                childArray.push((showTimes[x].dateTime).slice(11, 16));
            }
            if (x == showTimes.length - 1) {
                showTimeDisplayArray.push({
                    "theatre": storeTheatre,
                    "id": showTimes[x].theatre.id,
                    "getTickes": ticketsURL,
                    "times": childArray
                })
            }


        }
        showTimeDisplayArrayStringified = JSON.stringify(showTimeDisplayArray);
        // console.log(showTimeDisplayArray);
        database.ref().update({
            "winingShowTimes": showTimeDisplayArrayStringified
        });

        moviesContainer.empty();
        var movieContainer = $("<div class='row'>").css("float", "left").css("width", "40%");
        var movieIMG = $("<img>").attr("src", posterURL).css("width", "50%").addClass("col-sm").attr("id", "resultsImage");
        // moviesContainer.append("<h4 class='row'>Winning Movie</h4>");

        // movieContainer.append(movieIMG);

        // moviesContainer.append(movieContainer)

        var timesContainer = $("<div>").css("width", "40%").css("float", "left").addClass("col-sm row").attr("id", "resultsField");
        for (x in showTimeDisplayArray) {
            timesContainer.append("<b>" + showTimeDisplayArray[x].theatre + " - ID: " + showTimeDisplayArray[x].id + "</b>")
            for (y in showTimeDisplayArray[x].times) {
                var str = showTimeDisplayArray[x].id + "_" + showTimeDisplayArray[x].times[y]
                timesContainer.append("<p class='time' vote='false' id=" + str + ">" + showTimeDisplayArray[x].times[y] + "</p>");

            }

        }
        var movieDiv = $("<div class='row'>").append(movieIMG, timesContainer);
        // moviesContainer.append(timesContainer);
        moviesContainer.append(movieDiv);

    });

}

function allVotingEnded() {
    database.ref().once("value", function (snapshot) {
        var winningTime = snapshot.child("winningTime").val();
        var tempID = winningTime.slice(0, 3)
        var winTime = winningTime.slice(5, 10);
        var showTimeDisplayArray = JSON.parse(snapshot.child("winingShowTimes").val())
        var winMovie = snapshot.child("winningMovie").val();

        var posterIndexs = JSON.parse(snapshot.child("posterURLs").val());
        // console.log(posterIndexs);
        var posterIndex = posterIndexs.findIndex(obj => obj.Name == winMovie);
        var posterURL = posterIndexs[posterIndex].URL;
        // console.log(showTimeDisplayArray);
        for (x in showTimeDisplayArray) {
            if ((showTimeDisplayArray[x].id.includes(tempID))) {
                winTheatre = (showTimeDisplayArray[x].theatre);
                winLink = (showTimeDisplayArray[x].getTickets);
                break;
            }

        }
        var winMovie = snapshot.child("winningMovie").val();

        moviesContainer.empty();

        var movieContainer = $("<div>").css("float", "left").css("width", "40%");
        var movieIMG = $("<img>").attr("src", URL).css("width", "90%");
        // moviesContainer.append("<h4>Winning Movie</h4>");
        movieContainer.append(movieIMG);
        movieContainer.append("<p>" + winMovie + "</p>");
        movieContainer.append("<p>" + winTheatre + "</p>");
        movieContainer.append("<p>" + winTime + "</p><br>");
        movieContainer.append("<a href=" + winLink + ">Get Tickets</a>")

        moviesContainer.append(movieContainer);
        // console.log(showTimeDisplayArray);
        // console.log(winTheatre);
        // console.log(winLink);


    });

}

//ON CLICKS
$(votingData).on("click", function (e) {
    if (e.target.id == "clearVotesBtn") {
        console.log("Votes Cleared");
        database.ref("votes").set({
            "No votes yet 1": "0",
            "No votes yet 2": "0",
            "No votes yet 3": "0"
        });
    }
    if (e.target.id == "endMovieVotingBtn") {
        console.log("Vote Ending");
        database.ref("flags").update({
            "movieVoting": false,
            "timeVoting": true

        });
        voteMovieTimes();
    }

    if (e.target.id == "clearTimeVotesBtn") {
        console.log("Votes Cleared");
        database.ref("votesTime").set({
            "No votes yet 1": "0",
            "No votes yet 2": "0",
            "No votes yet 3": "0"
        });
    }
    if (e.target.id == "endTimeVotingBtn") {
        console.log("Vote Ending");
        database.ref("flags").update({
            "movieVoting": false,
            "timeVoting": false,
            "allVotingEnded": true

        });


        allVotingEnded();


    }

})

moviesContainer.on("click", function (e) {
    var targetImgID = e.target.id;

    if (e.target.className == "time") {
        var timeVote = $(e.target).attr("vote");
        // console.log(timeVote);
        // var timeVoted = e.target.getAttribute("vote"); ✔
        if (timeVote != "true") {
            $(e.target).attr("vote", "true")
            if (e.target.id in votesTime) {
                updatedVote = (parseInt(votesTime[e.target.id]) + 1).toString();
            } else {
                updatedVote = "1"
            }
            database.ref("votesTime").update({
                [e.target.id]: updatedVote
            });
            $(e.target).text("✔" + $(e.target).text());

        } else {
            $(e.target).attr("vote", "false")
            if (e.target.id in votesTime) {
                updatedVote = (parseInt(votesTime[e.target.id]) - 1).toString();
            } else {
                updatedVote = "0"
            }
            database.ref("votesTime").update({
                [e.target.id]: updatedVote
            });
            temp = $(e.target).text()
            temp = temp.slice(1);
            $(e.target).text(temp)

        }

    }


    if (e.target.id == "submitDateAndZip") {
        movieDate = moment($("#getDate").val(), "MM-DD-YYYY").format("YYYY-MM-DD");
        movieZip = $("#getZip").val();

        database.ref("flags").update({
            "movieVoting": true,
            "selectedDate": movieDate,
            "selectedZip": movieZip,
            "timeVoting": false
        });

    }

    if ((targetImgID).endsWith("check")) {
        targetImgID = targetImgID.slice(0, targetImgID.length - 5)
    } else if (targetImgID.startsWith("MV")) {
    } else {
        return;
    }
    var movieName = $("#" + targetImgID).attr("name");
    var targetCheckmarkID = targetImgID + "check";

    if ($("#" + targetCheckmarkID).css("display") == "none") {
        $("#" + targetImgID).attr("vote", "true");
        $("#" + targetCheckmarkID).toggle();
        if (movieName in votes) {
            updatedVote = (parseInt(votes[movieName]) + 1).toString();
        } else {
            updatedVote = "1"
        }
        database.ref("votes").update({
            [movieName]: updatedVote
        });
    } else {
        $("#" + targetImgID).attr("vote", "false");
        $("#" + targetCheckmarkID).toggle();
        if (movieName in votes) {
            updatedVote = (parseInt(votes[movieName]) - 1).toString();
        } else {
            updatedVote = "0"
        }
        database.ref("votes").update({
            [movieName]: updatedVote
        });
    }

});
$("#movies").on("click", function () { startMovie() });