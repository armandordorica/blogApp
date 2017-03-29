var bodyParser = require("body-parser");
var mongoose       = require("mongoose");
var express        = require("express");
var app            = express();
var methodOverride = require("method-override");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));



//Setting up the schema
// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//Compiling a blog variable into a model
var Blog = mongoose.model("Blog", blogSchema);


//CREATING AN INSTANCE OF A BLOG (for testing purposes)
// Blog.create({
//     title: "Test blog", 
//     image: "https://images.unsplash.com/photo-1465588042420-47a53c2d0320?dpr=2&auto=format&fit=crop&w=767&h=483&q=80&cs=tinysrgb&crop=",
//     body: "Hello this is a blog post"
// });



//RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index", {blogs: blogs});
            //We're passing the data of whatever comes back from Blog.find()
        }
    });
});

//NEW Route 
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //then redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        console.log(req.params.id);
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
});


//EDIT route 
app.get("/blogs/:id/edit", function(req, res) {
    //Just like the show route
    Blog.findById(req.params.id, function(err, foundBlog){
        console.log(req.params.id);
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit", {blog: foundBlog});
       }
    });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

//DELETE route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING"); 
});

