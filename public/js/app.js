// ****** LOCAL STORAGE ******** 
function saveData(userDate, userZipCode, movieTitle, theaterName, movieTime) {
    // Clear absolutely everything stored in localStorage using localStorage.clear()
    localStorage.clear();

    // Store the zipcode into localStorage using "localStorage.setItem"
    localStorage.setItem("zipcode", userZipCode);
    console.log("Local Storage ZipCode: " + localStorage.getItem("zipcode"));

    // Creates local "temporary" object for holding Dinner * Movie data
    var movieDinner = {
        date: userDate,
        zipCode: userZipCode,
        title: movieTitle,
        theater: theaterName,
        time: movieTime,
    };
};
// **** END OF LOCAL STORAGE CODE ***********

//Validating the user inputs from the form
function inputValidation(zip, userDate) {
    $("#errorTextZip").empty();
    $("#errorTextDate").empty();
    $("#movieTitles").empty();
    $("headerDiv").empty();
    var numberOfDigits = Math.floor(Math.log(zip) / Math.LN10 + 1)
    // if ((userDate >= moment().format("YYYY-MM-DD")) && ((zip > 10000) && (zip < 99999))) {
    if ((userDate >= moment().format("YYYY-MM-DD")) && ((zip > 0) && (numberOfDigits==5))) {
        console.log("*********** Input Correct ******");
        console.log("Number of digits: "+numberOfDigits);
        return true;
    }
    else {
        // if ((zip < 10000) || (zip > 99999)) {
        if ((zip <= 0) || (numberOfDigits!=5)) {
            console.log("Input Validation-->Wrong Zip: " + zip);
            console.log("Number of digits: "+numberOfDigits);
            $("#errorTextZip").append("Enter a valid zip code with 5 Digits (ex. 60647)")
        }
        if ((userDate < moment().format("YYYY-MM-DD"))) {
            console.log("Input validation --> Wrong Date: " + userDate);
            $("#errorTextDate").append("Enter a valid date (mm/dd/yyyy). Dates before today are not available.")
        }
        return false;
    }
}

//To display all the movies after the user submits their info
function submitUserInfo() {

    $("#submitButton").on("click", function () {
        event.preventDefault();

        var userEnteredDate = $("#movieDate").val();
        var userDate = moment(userEnteredDate).format("YYYY-MM-DD");
        var userZipCode = $("#zipCode").val();
        var movieTitle = "";
        var theaterName = "";
        var movieTime = "";
        console.log("This is the user entered date: " + userDate);
        console.log("This is the user entered zip: " + userZipCode);

        if (inputValidation(userZipCode, userDate)) {
            // Calling SaveData() to store info in Firebase
            saveData(userDate, userZipCode, movieTitle, theaterName, movieTime);

            // Empty the fields when the submit button is clicked
            $("#movieDate").val("");
            $("#zipCode").val("");

            var newUser = {
                moviedinner_date: userDate,
                zipcode: userZipCode
            }

            console.log("Here is the new user data: ", newUser);

            //Make an AJAX call to our users database to post the movieDate and zipCode
            $.ajax("/api/users", {
                type: "POST",
                data: newUser
            }).then(function (){
                console.log("New user added.");
            });

            $.ajax("/api/users", {
                type: "GET",
                // data: newUser
            }).then(function (response){
                //console.log("User Data.");
                //console.log(response);
            });

            $.ajax("/api/movie", {
                type: "GET",
                data: newUser
            }).then(function (response){
                console.log("Gracenote returning movie data.");
                
                var headerDIVTitle = $("<h3>").text("Movies Playing Near You").addClass("text-center");

                $("#headerDIV").prepend(headerDIVTitle);

                // Store the JSON response in a variable
                var movieData = JSON.parse(response);
                console.log("Here's the movie JSON: ", movieData);

                // Looping over the results in the JSON object...
                for (var i = 0; i < movieData.length; i++) {

                    // Create a DIV to hold each of our movie titles and its description
                    var movieDisplayDiv = $("<div>").addClass("movieDIV").addClass("card").attr("style", "width: 16rem");

                    // var cardIMGDiv = $("<div>").addClass("card-image-top");

                    // var cardIMG = $("<img>").attr("src", "./images/popcorn.jpg").attr("width",100);

                    // Create a variable to hold each movie title and the unique movie ID
                    var movieTitle = [];
                    movieTitle = movieData[i].title;
                    console.log(movieTitle);

                    var movieID = [];
                    movieID = movieData[i].tmsId;
                    console.log(movieID);

                    // Create a variable to hold the transformed movie title so that we can call the OMDB API to get the movie poster
                    var omdbTitle = movieTitle.replace(/ /g,"+");
                    console.log(omdbTitle);

                    // var omdb = {
                    //     movie: omdbTitle
                    // }
                    // console.log("Here's the movie data to pass to the OMDB API: ", omdb);

                    // $.ajax("api/poster", {
                    //     type: "GET",
                    //     data: omdb,
                    //     async: false
                    // }).then(function(response) {
                    //     console.log("OMDB returning movie data.");
                    //     var omdbMovies = JSON.parse(response);
                    //     console.log("Here's the response from OMDB API: ", omdbMovies);
                    //     var moviePoster = omdbMovies.Poster
                    //     console.log("Here's the movie poster link from OMDB API: ", moviePoster);
                    //     var cardIMGDiv = $("<div>").addClass("card-image-top");

                    //     var cardIMG = $("<img>").attr("src", moviePoster).attr("width",100);

                    //     var moviePosterCard = cardIMGDiv.append(cardIMG);
                    //     console.log("HERE IS THE POSTER DIV: ", moviePosterCard);
                    // });

                    // Create an inner DIV for each movie title and description to utilize the card component from Bootstrap
                    var innerMovieDiv = $("<div>").addClass("card-content");

                    // Display the movie title in each individual DIV
                    var titleDisplay = $("<a>").text(movieTitle).addClass("card-title movieTitle").attr("data-movieid", movieID).attr("data-movietitle", movieTitle).attr("data-omdbtitle", omdbTitle);

                    // Create a variable to hold each movie description
                    var movieDescr = movieData[i].shortDescription;

                    // Display the movie description in each individual DIV
                    var descrDisplay = $("<p>").text(movieDescr).addClass("movieDescr").addClass("card-title");

                    // Add the movie title and the description to the individual DIV
                    // cardIMGDiv.append(cardIMG);
                    
                    // movieDisplayDiv.append(cardIMGDiv);
                    
                    innerMovieDiv.append(titleDisplay, descrDisplay)

                    movieDisplayDiv.append(innerMovieDiv);

                    // Add all the movies to an existing DIV on the apge called movieTitles
                    $("#movieTitles").append(movieDisplayDiv);

                }
                $(document).on("click", "a", function () {
                    // Using 'this', create a variable that grabs the movie ID in the id attribute for the specific movie title that the user has clicked on.
                    var movieID = $(this).data("movieid");
                    console.log("Here's the movie ID: ", movieID);

                    var movieTitle = $(this).data("movietitle");
                    console.log("Here's the movie title: ", movieTitle);
                
                    // Create a variable that returns the index number of the movie that matches that movie ID that was clicked. We can use this index number to plug into the for loop to only loop through that movie's showtimes.
                    var selectedMovie = movieData.findIndex(function (movie) {
                        return movie.tmsId === movieID;
                    });
                    console.log("This is the selected movie's index: " + selectedMovie);
                
                    // Create an empty array that will hold a list of generated objects containing each movie theatre and showtime.
                    var movieTheatres = [];
                    var theatreNames = [];
                
                    // Loop through all the movie showtimes of the array that we have selected to get the theatres names by using the index number generated above
                    for (var i = 0; i < movieData[selectedMovie].showtimes.length; i++) {
                        // Create a variable to hold each of the theatre names for each showtime in the array
                        var theatreName = movieData[selectedMovie].showtimes[i].theatre.name;
                        //console.log("Here's the theatre name: " + theatreName);
                
                        // Create an if statement using the indexOf method that will create a new array to hold all the theatre names. A theatre name will only be pushed to the array if that theatre name is not present ( == -1).
                        if (theatreNames.indexOf(theatreName) < 0) {
                            theatreNames.push(theatreName);
                        }
                    }
                
                    console.log("All movie theatres  for this particular movie: ", theatreNames);
                
                    // Loop through the theatreName array to get all showtimes and put them in a new object with each theatre
                    for (var i = 0; i < theatreNames.length; i++) {
                        // Create a new variable that will use the filter function to create a new array to hold all of the movie showtimes by theatre
                        var showtimes = movieData[selectedMovie].showtimes.filter(function (showtime) {
                            //console.log("DATA", showtime);
                            return showtime.theatre.name == theatreNames[i];
                        });
                        // Push an object containing 2 properties: name (containing the name) and times (blank array that will hold the showtimes that will be generated by the next for loop)
                        movieTheatres.push({ name: theatreNames[i], times: [] });
                        //console.log("Showtime: ", showtimes);
                        // Loop through the showtimes array and push all the showtimes into the empty 'times' property in the object in the movieTheatre array
                        for (j = 0; j < showtimes.length; j++) {
                            //console.log("Showtimes: " , showtimes[j]);
                            movieTheatres[i].times.push(showtimes[j].dateTime);
                        }
                    }
                    console.log(movieTheatres)
                
                    //When the user clicks a movie title, grab all the theatres and the corresponding show times and display that in a new div within the movie title div
                    for (let i = 0; i < movieTheatres.length; i++) {
                
                        var theatre = movieTheatres[i].name;
                        console.log("Theatre: " + theatre);
                
                        var movieTimes = movieTheatres[i].times.map(function (element) {
                            return moment(element).format('h:mm A');
                        });
                        console.log("Movie times: " + movieTimes);

                        var showtimesDIV = $("<div>").addClass("showtimesDIV").attr("data-theatre", theatre);
                        //console.log("DIV " + showtimesDIV);
                
                        showtimesDIV.append("<p>" + "<strong>" + theatre + "</strong>" + "</p>" + "<span data-theatre=" + '"' + theatre + '">' + movieTimes.join(", ") + ("</span>") + "<hr>");
                
                        $(this).parent().append(showtimesDIV);
                    }
                
                    var restaurantPage = $("<button>").addClass("waves-effect waves-light btn red accent-2 dinnerButton").attr("type", "button").html('<a href="./index_restaurant.html">Next</a>');
                
                    $(this).parent().append(restaurantPage);
                
                });
            });
        }
    });
};

// Call the function
submitUserInfo();

