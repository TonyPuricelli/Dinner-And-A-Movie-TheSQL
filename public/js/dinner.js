// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// YELP Node Stuff

const yelp = require('yelp-fusion');

// ============================
// Routes
// =============================================================
module.exports = function (app) {


//Route to call the Yelp API to retrieve dinner information

$.ajax("/api/dinner", {
    type: "GET",
    data: newUser
}).then(function (response){
    console.log("YELP Returned Restaurant Data.");
    console.log(response);

});