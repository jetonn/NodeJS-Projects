// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = ["Run", "Code"]; // This contains all the new items added on the todo list

app.get("/", function(req, res){
  let today = new Date();

  // Format the date to display required information
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  // Save the date as "Day Name #, Month Name" in a variable
  let day = today.toLocaleDateString("en-US", options);
  // Pass the data to the "list.ejs" file
  res.render("list", {kindOfDay: day, itemsArray: items});

});

app.post("/", function(req, res){
  item = req.body.todoItem;

  items.push(item);
  res.redirect("/");
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
