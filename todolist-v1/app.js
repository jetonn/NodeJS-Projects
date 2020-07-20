// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const _ = require("lodash");

// Open a connection to the 'todoDB' database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todoDB', {useNewUrlParser: true, useUnifiedTopology: true });
// Get the default connection
var db = mongoose.connection;

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// --------------------------- Storing data to MongoDB ---------------------------
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);


const item1 = new Todo({
  item: 'Welcome to your todolist!'
});

const item2 = new Todo({
  item: 'Hit the + button to add a new item.'
});

const item3 = new Todo({
  item: '<-- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [todoSchema]
};

const List = mongoose.model("List", listSchema);

// ---------------------------

app.get("/", function(req, res){
  // let today = new Date();
  //
  // // Format the date to display required information
  // let options = {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric"
  // };
  // // Save the date as "Day Name #, Month Name" in a variable
  // let day = today.toLocaleDateString("en-US", options);

  Todo.find({}, function(err, foundItems){
    if (err) return handleError(err);
    console.log(foundItems);
    // Pass the data to the "list.ejs" file

    if (foundItems.length === 0) {
      Todo.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", itemsArray: foundItems});
    }
  });
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect(`/${customListName}`);
      } else {
        // Show an existing list
        res.render("list", {listTitle: foundList.name, itemsArray: foundList.items});
      }
    }
  });


});

app.post("/", function(req, res){
  const itemName = req.body.todoItem;
  const listName = req.body.list;

  const item = new Todo({
    item: itemName
  });

  if (listName === "Today") {
    console.log('This is today');
    item.save();
    res.redirect('/');
  } else {
    console.log("this is today elseeeee");
    console.log(req.body);
    console.log(itemName);
    List.findOne({name: listName}, function(err, foundList){
      console.log(foundList);
      console.log(item);
      foundList.items.push(item);
      console.log(foundList);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Todo.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(8000, function(){
  console.log("Server started on port 8000");
});
