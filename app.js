//  ----------- Modules require ------------
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require('lodash');



//  ------------ Modules setups ------------

// Set the view engine to ejs
app.set("view engine", "ejs");
// Body parser for parsing data from ejs file
app.use(bodyParser.urlencoded({
  extended: true
}));



//  ------------- Mongoose and DB ----------------
// connecting mongoose to mongoDB
mongoose.connect("mongodb://localhost:27017/mvp");






const itemSchema = new mongoose.Schema({
  // UPC-A
  barcode: Number,
  quantity: Number,

  floor: Number,
  shelf: String,
  level: Number,

  product: String,
  brand: String,
  name: String

})

const deletedSchema = new mongoose.Schema({
  comment: String,
  item: itemSchema,
})

const Item = mongoose.model('item', itemSchema);
const Delete = mongoose.model('delete', deletedSchema);




// --------- Routing -------------------
app.get("/", (req, res) => {
  res.render("index", {
    testValue: "MVP page",
  });
});

app.get("/show", (req, res) => {

  // Promise here!
  Item.find((err, results) => {
    if (!err) {
      res.render("show", {
        items: results,
      });
    };
  });
});

app.get("/edit", (req, res) => {
  // query parameter
  const id = req.query.edit;

  //  Promise here!
  Item.findById(id, (err, result) => {
    if (!err) {
      res.render("edit", {
        item: result,
      });
    };

  });
});


app.get("/search", (req, res) => {
  res.render('search');
});


app.get("/results", (req, res) => {

  const searchRequest = req.query;
  // Duplicate
  const filter = {};
  for (const key in searchRequest) {
    if (searchRequest[key] !== "" || searchRequest[key] === String) {

      filter[key] = _.startCase(searchRequest[key]);
    } else if (searchRequest[key] !== "" || searchRequest[key] === Number) {
      filter[key] = searchRequest[key];
    }
    console.log(filter);
  };

  Item.find(filter, (err, results) => {
    if (!err) {
      console.log(`results are: ${results}`);
      res.render('result', {
        items: results
      });
    }
  })

});


app.get("/deleted", (req, res) => {
  const filter = {
    _id: req.query.id
  };
  console.log(filter);
  Delete.find(filter, (err, results) => {
    if (!err) {
      console.log("delete get Page: "+results);
      res.render("deleted", {
        items: results,
      });
    } else {
      console.log(err);
    }
  });
});


app.post("/", (req, res) => {
  //  Barcode
  const barcode = req.body.barcode;
  const quantity = req.body.quantity;
  //  Location
  const floor = req.body.floor;
  const shelf = req.body.shelf;
  const level = req.body.level;
  //  info
  const product = _.startCase(req.body.product);
  const brand = _.startCase(req.body.brand);
  const name = _.startCase(req.body.name);

  const item = new Item({
    barcode: barcode,
    quantity: quantity,
    floor: floor,
    shelf: shelf,
    level: level,

    product: product,
    brand: brand,
    name: name
  }, );
  item.save();

  res.redirect("/show");
});



//  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ developing Feature

app.post("/delete", (req, res) => {

  const id = req.body.delete;
  console.log(req.body.type);

  if(req.body.type === "validation"){

    const comment = req.body.comment;

    // barcode change for later
    Item.findById(id, (err, results) => {
      if (!err) {
        const deletedItem = new Delete({
          comment: comment,
          item: results
        });
        console.log(deletedItem);
        deletedItem.save();
        res.redirect(`/deleted?id=${deletedItem._id}`);

      } else {
        console.log(err);
      }
    });

    // send Id to deleted page to show !

  } else {
    // ##################################################
    // Promise here!
    Item.findByIdAndRemove(id, (err, deleted) => {
      if (!err) {



        console.log(`${deleted} has been deleted`)
      } else {
        console.log(err)
      };
    });

    res.redirect("/show");


    // ###########################################################

  }
});





app.post("/update", (req, res) => {

  const submitedUpdates = req.body;
  const itemId = req.body.id;

  delete submitedUpdates.id;

  const update = {};
  for (const key in submitedUpdates) {
    if (submitedUpdates[key] !== "" || submitedUpdates[key] === String) {

      update[key] = _.startCase(submitedUpdates[key]);
    } else if (submitedUpdates[key] !== "" || submitedUpdates[key] === Number) {
      update[key] = submitedUpdates[key];
    }

  };




  Item.findByIdAndUpdate(itemId, update, {
    new: true
  }, (err, result) => {
    if (!err) {
      console.log(result);
    } else {
      console.log(err);
    }
  });


  res.redirect("/show");
});




// ----------- Binds and listen for the connections
app.listen(3000, () => {
  console.log("Server successfully has started on port 3000");
})
