var mongoose = require("mongoose");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");

var data = [
        {
            title: "Learning to code - part 1",
            image: "http://kellerelementary.weebly.com/uploads/2/5/7/9/25792133/coding.jpg",
            body: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>"
        },
        {
            title: "Learning to code - part 2",
            image: "http://www.globaleducates.com/blog/wp-content/uploads/2014/12/keep-calm-and-try-coding.png",
            body: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>"
        },
        {
            title: "JavaScript tips for beginners",
            image: "https://sdtimes.com/wp-content/uploads/2015/05/0506.sdt-javascript.jpg",
            body: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>"
        },
        {
            title: "Responsive web design",
            image: "http://epicmediainc.com/wp-content/uploads/2017/03/Responsive-Design.jpg",
            body: "<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p> <p>sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p> <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p> <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere.</p>"
        }
    ]

function seedDB() {
    Blog.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("All blog posts have been removed.");
        }
        //Add a few blog posts:
        data.forEach(function(seed) {
            Blog.create(seed, function(err, post) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a post");
                    //Create a comment:
                    Comment.create(
                            {
                                text: "This is a great article, thanks for posting!",
                                author: "Bob the Builder"
                            }, function(err, comment) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    post.comments.push(comment);
                                    post.save();
                                    console.log("Created new comment.");
                                }
                            }
                        );
                    
                }
            });
        });
    });
}

//Export the seedDB function so it can be used in app.js

module.exports = seedDB;