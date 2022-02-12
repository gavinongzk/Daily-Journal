//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")
require("dotenv").config();

const homeStartingContent = "This is an app that allows you to enter your daily journal entries.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Mongoose Setup
mongoose.connect(process.env.MONGODB_ATLAS_API + "/blogDB");


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


// Global variables

// Home

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {contact: contactContent});
})

app.get("/about", (req, res) => {
  res.render("about", {about: aboutContent});
})

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {


  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composePost
  });

  post.save( (err) => {
    if (!err) {
      res.redirect("/");
    };
  });

});



app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post) => {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    };
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started.");
});

// MongoDB setup
