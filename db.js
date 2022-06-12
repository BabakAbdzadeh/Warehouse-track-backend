const mongoose = require("mongoose");

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


// This one can be used for later one features
const deletedSchema = new mongoose.Schema({
  comment: String,
  item: itemSchema,
})

const Item = mongoose.model('item', itemSchema);
const Delete = mongoose.model('delete', deletedSchema);




module.exports =  {Item, Delete};
