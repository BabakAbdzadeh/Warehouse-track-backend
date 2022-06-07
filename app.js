//  ----------- Modules require ------------
 const express = require('express');
 const bodyParser = require("body-parser");
 const app = express();
const mongoose = require("mongoose");



//  ------------ Modules setups ------------

// Set the view engine to ejs
app.set("view engine", "ejs");
// Body parser for parsing data from ejs file
app.use(bodyParser.urlencoded({
  extended:true
}));



//  ------------- Mongoose and DB ----------------
// connecting mongoose to mongoDB
mongoose.connect("mongodb://localhost:27017/mvp");

const itemSchema = new mongoose.Schema({
  product: String,
  brand : String,
  model: String,
  amount: Number
});

const Item = mongoose.model('item', itemSchema);





 // --------- Routing -------------------
 app.get("/", (req, res)=>{
   res.render("index", {
     testValue : "MVP page",
   });
 });

 app.get("/show", (req, res)=>{

   // Promise here!
   Item.find((err, results)=>{
     if(!err){
       res.render("show", {
         items : results,
       });
     };
   });
 });

 app.get("/edit", (req, res)=>{
   // query parameter
   const id = req.query.edit;

   //  Promise here!
   Item.findById( id, (err, result)=>{
     if(!err){
       res.render("edit", {
         item : result,
       });
     };

   });
 });

 app.post("/", (req,res)=>{
   const product = req.body.product;
   const brand = req.body.brand;
   const model = req.body.model;
   const amount = req.body.amount;

   const item = new Item({
     product: product,
     brand : brand,
     model : model,
     amount : amount
   });
   item.save();

  res.redirect("/show");
 });

 app.post("/delete", (req,res)=>{
   const id = req.body.delete;

   // Promise here!
   Item.findByIdAndRemove(id,(err, deleted)=> {
     if(!err){
       console.log(`${deleted} has been deleted`)
     }else{
       console.log(err)
     };
   } );
   res.redirect("/show");

 });


app.post("/update", (req, res)=> {

  const submitedUpdates = req.body;
  const itemId = req.body.id;

  // clear additional data from the object
  delete submitedUpdates.submit;
  delete submitedUpdates.id;

  const update = {}
  for(const key in submitedUpdates){
    if(submitedUpdates[key] !== ""){
      update[key] = submitedUpdates[key];
    }
  };

  Item.findByIdAndUpdate(itemId, update, {new: true}, (err, result)=>{
    if(!err){
      console.log(result);
    }else{
      console.log(err);
    }
  })


  res.redirect("/show");
})



// ----------- Binds and listen for the connections
app.listen(3000, ()=>{
  console.log("Server successfully has started on port 3000");
})
