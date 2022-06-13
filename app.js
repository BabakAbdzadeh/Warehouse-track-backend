//  ----------- Modules require ------------
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
// const mongoose = require("mongoose"); //!!!!
const _ = require('lodash');
const db = require('./db.js');


// API setup
const json = express.json();
app.use(express.json());
const Item = db.Item;
const Delete = db.Delete;


//  ------------ Modules setups ------------

// Set the view engine to ejs
app.set("view engine", "ejs");
// Body parser for parsing data from ejs file
app.use(bodyParser.urlencoded({
  extended: true
}));



// --------- Routing -------------------
// Addinv inventory page
app.route("/")
  .get((req, res) => {
    res.render("index", {
      testValue: "MVP page",
    });
  })
  .post((req, res) => {

    const item = new db.Item({
      barcode: req.body.barcode,
      quantity: req.body.quantity,
      floor: req.body.floor,
      shelf: req.body.shelf,
      level: req.body.level,
      // using lodash module, useful for later on search
      product: _.startCase(req.body.product),
      brand: _.startCase(req.body.brand),
      name: _.startCase(req.body.name)
    }, );
    item.save();
    res.redirect("/show");
  });

// get request to show all inventories
app.get("/show", (req, res) => {

  db.Item.find((err, results) => {
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

  db.Item.findById(id, (err, result) => {
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

  const filter = objectValidFinder(searchRequest);

  db.Item.find(filter, (err, results) => {
    if (!err) {
        console.log(`${Object.keys(results).length}`);
      if(Object.keys(results).length === 0 ){
        res.render('result',{
          items: "empty"
        });

      }else{
        res.render('result', {
          items: results
        });
      }
    }
  })

});

// -------------- Rename -----------------------
app.get("/deleted", (req, res) => {
  const filter = {
    _id: req.query.id
  };
  console.log(filter);
  db.Delete.find(filter, (err, results) => {
    if (!err) {
      console.log("delete get Page: " + results);
      res.render("deleted", {
        items: results,
      });
    } else {
      console.log(err);
    }
  });
});


//  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ developing Feature
app.post("/delete", (req, res) => {

  const id = req.body.delete;


  if (req.body.type === "validation") {

    const comment = req.body.comment;

    // barcode change for later
    db.Item.findById(id, (err, results) => {
      if (!err) {
        const deletedItem = new db.Delete({
          comment: comment,
          item: results
        });

        deletedItem.save();
        res.redirect(`/deleted?id=${deletedItem._id}`);

      } else {
        console.log(err);
      }
    });
  } else {

    db.Item.findByIdAndRemove(id, (err, deleted) => {
      if (!err) {

        console.log(`${deleted} has been deleted`)
      } else {
        console.log(err)
      };
    });

    res.redirect("/show");
  }
});


app.post("/update", (req, res) => {

  const submitedUpdates = req.body;
  const itemId = req.body.id;
  // due to the pointer first have to save id then delete it
  delete submitedUpdates.id;

  const update = objectValidFinder(submitedUpdates);

  db.Item.findByIdAndUpdate(itemId, {
    $set: update
  }, {
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

//  -------------------- Functions -----------

// loop through the object (only works with string and number properties)
// and gets all valid Property/values
function objectValidFinder(inputObject) {
  const update = {};
  for (const key in inputObject) {
    if (inputObject[key] !== "" || inputObject[key] === String) {

      update[key] = _.startCase(inputObject[key]);
    } else if (inputObject[key] !== "" || inputObject[key] === Number) {
      update[key] = inputObject[key];
    }

  };
  return update;
};



// -------------- API ------------------------

// Get index, fetch all

app.route("/api/inventory")

.get((req, res) => {
  Item.find((err, results) => {
    if (!err) {
      res.send(results);
    } else {
      res.send(err);
    }
  });
})

// Get  fetch specific
.post((req, res) => {
  const item = new Item({
    barcode: req.body.barcode,
    quantity: req.body.quantity,
    floor: req.body.floor,
    shelf: req.body.shelf,
    level: req.body.level,

    product: req.body.product,
    brand: req.body.brand,
    name: req.body.name
  }, );
  item.save((err) => {
    if (!err) {
      res.send("Successfully added a new item to inventory");
    } else {
      res.send(err);
    }
  });
});


app.put("/api/inventory/:id", (req, res) => {

  const itemId = req.params.id;
  const submitedUpdates = req.body;
  console.log(itemId);
  console.log(submitedUpdates);

  delete submitedUpdates.id;

  const update = {};
  for (const key in submitedUpdates) {
    if (submitedUpdates[key] !== "" || submitedUpdates[key] === String) {

      update[key] = _.startCase(submitedUpdates[key]);
    } else if (submitedUpdates[key] !== "" || submitedUpdates[key] === Number) {
      update[key] = submitedUpdates[key];
    }

  };
  Item.findByIdAndUpdate(itemId, update, {new: true}, (err, result) =>
  {
    if (!err) {
      console.log("Updated, results:"+ update);
       
      
    
      
    } else {
      console.log(err);
    }
  });
  res.send("Successfully added a new item to inventory");
    

});


app.route("/api/inventory/:id/:comment")

.delete((req, res) => {
  const id = req.params.id;
  const comment= req.params.comment;

  

  Item.findById(id, (err, results) => {
    if (!err) {
      const deletedItem = new Delete({
        comment: comment,
        item: results
      });
      console.log(deletedItem);
      deletedItem.save();


    } else {
      console.log(err);
    }
  });
  Item.findByIdAndRemove(id, (err, deleted) => {
    if (!err) {
      console.log(`${deleted} has been deleted`)
       if (!err) {
      res.send("Successfully deleted");
    } else {
      res.send(err);
    }
    } else {
      console.log(err)
    };
  });
});





// ----------- Binds and listen for the connections
app.listen(3000, () => {
  console.log("Server successfully has started on port 3000");
})
