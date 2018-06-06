// Display restaurant Info
// function displayRestaurantInfo() {
// ***************************

console.log("****** GOTO DINNER Button Clicked ******");

var zipCode = localStorage.getItem("zipcode")
console.log("*** Zip Code for Restaurant Search: " + zipCode);

yelpCall();

function yelpCall() {
    //Route to call the Yelp API to retrieve dinner information

    $.ajax("/api/dinner", {
        type: "GET",
        data: newUser
    }).then(function (response) {
        console.log("YELP Returned Restaurant Data.");
        console.log(response);
        var restresults = response;
        console.log("Array Length: " + response.results.length);

        // $("#movie-view").html(JSON.stringify(response,"",4));
        $("#restaurant-appear-here").html(JSON.stringify(response, "", 4));

        for (var i = 0; i < response.results.length; i++) {
            console.log("GOING FOR IT");
            // Create a DIV to hold each of our restaurants and its description
            var restDisplayDiv = $("<div>").addClass("restDIV").addClass("card").attr("style", "width: 18rem");

            // Create a variable to hold each restaurant name 
            var restName = response.results[i].name;
            console.log("Restaurant Name: " + restName);

            var googleMapsUrl = response.results[i].photos[0].html_attributions;
            console.log("Google Maps URL: " + googleMapsUrl);


            // Create an inner DIV for each Restaurant title and description to utilize the card component from Bootstrap
            var innerRestDiv = $("<div>").addClass("card-body").attr("id", restName);

            // Display the restaurant name in each individual DIV
            var nameDisplay = $("<h5>").text(restName).addClass("restName").addClass("card-title");

            // Create a variable to hold each Restaurant description

            var restOpen = response.results[i].opening_hours.open_now;
            console.log("Open: " + restOpen);
            var priceLevel = response.results[i].price_level;
            console.log("Price Level: " + priceLevel);
            var rating = response.results[i].rating;
            console.log("Rating: " + rating);


            // Display the Restaurant description in each individual DIV
            if (restOpen) {
                var openDisplay = $("<h6>").text("Open").addClass("openDisplay").addClass("card-title");
            }
            else { var openDisplay = $("<h6>").text("Closed").addClass("openDisplay").addClass("card-title"); }
            var priceDisplay = $("<h6>").text("Price Level: " + priceLevel).addClass("priceDisplay").addClass("card-title");
            var ratingDisplay = $("<h6>").text("Google Rating: " + rating).addClass("ratingDisplay").addClass("card-title");

            // Add the restaurant name and other info to the individual DIV
            innerRestDiv.append(nameDisplay, openDisplay, priceDisplay, ratingDisplay)

            restDisplayDiv.append(innerRestDiv);

            // Add all the restaurants to an existing DIV on the apge called nearbyRestaurants
            // $("#restaurant-appear-here").prepend(restDisplayDiv);
            $("#nearbyRestaurants").prepend(restDisplayDiv);
        }
    });
}





