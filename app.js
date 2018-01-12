var express = require('express');
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Config

mongoose.connect("mongodb://localhost/flyingfoxblog");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {
            type: Date,
            default: Date.now
        }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1433162653888-a571db5ccccf?auto=format&fit=crop&w=1350&q=80",
//     body: "This is the body text for the test blog entry."
// });

// Routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newPost) {
        if(err) {
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/blogs");
        } 
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running..");
});
