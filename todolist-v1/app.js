// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = ["Run", "Code"]; // This contains all the new items added on the todo list
let workItems = [];

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
  res.render("list", {listTitle: day, itemsArray: items});

});

app.post("/", function(req, res){
  item = req.body.todoItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", itemsArray: workItems});
});

app.post("/work", function(req, res){
  let item = req.body.todoItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(8000, function(){
  console.log("Server started on port 8000");
});
