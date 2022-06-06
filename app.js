//  ----------- Module require ------------
 const express = require('express');
 const bodyParser = require("body-parser");
 const app = express();



// Set the view engine to ejs
app.set("view engine", "ejs");

// Use body parser to parse data from ejs file
app.use(bodyParser.urlencoded({
  extended:true
}));


 // --------- Routing -------------------

 app.get("/", (req, res)=>{
   res.render("index", {
     testValue : "to the test page",
   });
 })

 app.post("/", (req,res)=>{
   let input = req.body.postRequestTest;
   console.log(input);
   res.redirect("/");
 })


// ----------- Binds and listen for connections
app.listen(3000, ()=>{
  console.log("Server successfully has started on port 3000");
})
