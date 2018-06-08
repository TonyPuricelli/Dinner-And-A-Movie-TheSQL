// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

const yelp = require('yelp-fusion');
const request = require('request');

// ============================
// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the user data
  app.get("/api/users", function (req, res) {
    //console.log("API call to get All user data");
    db.User.findAll({})
      .then(function (dbUser) {
        //console.log(dbUser);
        res.json(dbUser);
      });
  });

  // POST route for saving a new post
  app.post("/api/users", function (req, res) {
    console.log(req.body);
    db.User.create({
      moviedinner_date: req.body.moviedinner_date,
      zipcode: req.body.zipcode,
      movietitle: req.body.movieTitle,
      theater: req.body.theater,
      restaurantname: req.body.restaurantname,
      restaurantcategory: req.body.category
    })
      .then(function (dbUser) {
        res.json(dbUser);
      });
  });

  //Route to call the Gracenote API to retrieve the movie data
  app.get("/api/movie", function (req, res) {
    let zipCode = req.query.zipcode;
    console.log("ZIP CODE FROM MOVIE ROUTE: ", req.query.zipcode)
    let movieDate = req.query.moviedinner_date;
    console.log("DATE FROM MOVIE ROUTE: ", req.query.moviedinner_date);
    let graceNoteAPI = process.env.GRACENOTE_API;
    let graceNotequery = "https://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDate + "&zip=" + zipCode + "&imageSize=Sm&imageText=true&api_key=" + graceNoteAPI;
    console.log("HERE IS THE QUERY URL: ", graceNotequery);

    request(graceNotequery, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      res.json(body);
    });
  });

  //Route to call the OMDB API to retrieve poster information

  // app.get("/api/poster", function (req, res) {
  //   let movie = req.query.movie;
  //   console.log("MOVIE TITLE: ", movie)
  //   let omdbAPI = process.env.OMDB_API_KEY;
  //   let omdbquery = "http://www.omdbapi.com/?apikey=" + omdbAPI + "&t=" + movie;
  //   console.log("HERE IS THE QUERY URL: ", omdbquery);

  //   request(omdbquery, function (error, response, body) {
  //     console.log('error:', error); // Print the error if one occurred
  //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //     console.log(body);
  //     //console.log(JSON.parse(body.Poster));
  //     res.json(body);
  //   });
  // });
  
  //Route to call the Yelp API to retrieve dinner information

  app.get("/api/dinner", function (req, res) {
    console.log("ZIP CODE: ", req.query.zipcode);

    let zipCode = req.query.zipcode;
    //let zipCode = 60616;
    const yelpApiKey = process.env.YELP_API_KEY;

    //Specific information we want to get out of the searchRequest results

    const client = yelp.client(yelpApiKey);

    // API Search Parameters Documentation: https:/ / www.yelp.com / developers / documentation / v3 / business_search
    const searchRequest = {
      term: 'restaurants', //always include this to focus only on restaurants
      //categories: 'italian', //take in user inputs about the types of cuisines they want based on this list of categories: https://www.yelp.com/developers/documentation/v3/category_list?hl=en_US 
      location: zipCode, //can be address, neighborhood, city, state or zip
      // location: req.body.zipcode,
      radius: 1610, //a mile in meters; can search up to 25 miles
      //sort_by: distance, //by default its best_match
      limit: 10 //limit number of search results
    };

    console.log("Here's the search request: ", searchRequest)
    client.search(searchRequest).then(response => {
      const result = response.jsonBody.businesses;
      //const prettyJson = JSON.stringify(firstResult, null, 4);
      //console.log(prettyJson);

      //Loop through the results and pull out the specific data points for each result that gets returned
      for (var i = 0; i < result.length; i++) {
        //console.log("Here's the first result in the array: ", firstResult[i]);
        console.log("--------------------------------------");
        console.log("Here's the name of the restaurant for the result: ", result[i].name);
        console.log("Here's the image for the result: ", result[i].image_url);
        console.log("Here's the rating for the result: ", result[i].rating);
        console.log("Here's the price level for the result: ", result[i].price);
        console.log("Here's the address for the result: ", result[i].location.display_address);
        console.log("--------------------------------------");
      }
        res.json(result);
    }).catch(e => {
      console.log(e);
    });
  });

};