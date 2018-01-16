var express = require('express');
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");
var seedDB = require("./seed");

//Call the seed.js file:
seedDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose Config

mongoose.connect("mongodb://localhost/flyingfoxblog");



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

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundBlog);
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running..");
});
