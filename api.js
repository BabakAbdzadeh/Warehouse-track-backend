const express = require('express');
const json = express.json();
const app = express();
const mongoose = require("mongoose");
const _ = require('lodash');
app.use(express.json());



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

});


app.route("/api/inventory/:id/:comment")

.delete((req, res) => {
  const id = req.params.id;
  const comment= req.params.comment;

  console.log(id);
  console.log(comment);

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
    } else {
      console.log(err)
    };
  });
});


// ----------- Binds and listen for the connections
app.listen(2000, () => {
  console.log("Server successfully has started on port 2000");
});
