// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// YELP Node Stuff

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = '-rrTlTD5QkbxgYmvXexahskH_Iz7-0seC01qaSRXU2sCsUwp-umWyv3GbBVV0w5bNDyj7sw7-FamGxxD4KKHv-LNGdfjDxy0Lu11tXu2rd4sCqlenJ7h0wVd36-_WnYx';


//Specific information we want to get out of the searchRequest results

const client = yelp.client(apiKey);
// ============================
// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the user data
  app.get("/api/users", function (req, res) {
    console.log("API call to get All user data");
    db.User.findAll({})
      .then(function (dbUser) {
        res.json(dbUser);
      });
  });

  // Get route for returning posts of a specific category
  // app.get("/api/posts/category/:category", function(req, res) {
  //   db.Post.findAll({
  //     where: {
  //       category: req.params.category
  //     }
  //   })
  //     .then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  // });

  // Get route for retrieving a single user ID
  // app.get("/api/users/:id", function(req, res) {
  //   db.Post.findOne({
  //     where: {
  //       id: req.params.id
  //     }
  //   })
  //     .then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  // });

  // POST route for saving a new post
  app.post("/api/users", function (req, res) {
    console.log(req.body);
    db.users.create({
      moviedinner_date: req.body.moviedinner_date,
      zipcode: req.body.zipcode,
    })
      .then(function (dbUser) {
        res.json(dbUser);
      });
  });

  app.get("/api/dinner", function (req, res) {
    console.log("ZIP CODE: ",req.body.zipcode);
    // API Search Parameters Documentation: https:/ / www.yelp.com / developers / documentation / v3 / business_search
    const searchRequest = {
      term: 'restaurants', //always include this to focus only on restaurants
      categories: 'italian', //take in user inputs about the types of cuisines they want based on this list of categories: https://www.yelp.com/developers/documentation/v3/category_list?hl=en_US 
      location: '60616', //can be address, neighborhood, city, state or zip
      // location: req.body.zipcode,
      radius: 1610, //a mile in meters; can search up to 25 miles
      //sort_by: distance, //by default its best_match
      limit: 3 //limit number of search results
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


  // DELETE route for deleting posts
  // app.delete("/api/posts/:id", function(req, res) {
  //   db.Post.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   })
  //     .then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  // });

  // PUT route for updating posts
  // app.put("/api/posts", function(req, res) {
  //   db.Post.update(req.body,
  //     {
  //       where: {
  //         id: req.body.id
  //       }
  //     })
  //     .then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  // });
};