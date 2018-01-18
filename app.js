var express = require('express');
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seed");



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose Config

mongoose.connect("mongodb://localhost/flyingfoxblog");

//Call the seed.js file:
seedDB();

//Passport configuration:
app.use(require("express-session")({
    secret: "Nixon is a cat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("blogs/index", {blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("blogs/new");
});

app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newPost) {
        if(err) {
            console.log(err);
            res.render("blogs/new");
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
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("blogs/edit", {blog: foundBlog});
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

// ================================================================================

//Comment Routes

app.get("/blogs/:id/comments/new", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {blog: foundBlog});
        }
    });
});

app.post("/blogs/:id/comments", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if(err) {
                    console.log(err);
                } else {
                    blog.comments.push(newComment);
                    blog.save();
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

//Auth Routes:

//Register page:
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/blogs");
        });
    });
});

//Login page:
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs", 
        failureRedirect: "/login"
    }), function(req, res) {
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running..");
});
