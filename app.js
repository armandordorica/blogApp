var bodyParser = require("body-parser");
var mongoose       = require("mongoose");
var express        = require("express");
var app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));




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
//     image: "https://unsplash.com/photos/D9XX3Cjoh2s",
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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING"); 
});

