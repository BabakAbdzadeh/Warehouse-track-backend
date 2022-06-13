const mongoose = require("mongoose");

// connecting mongoose to mongoDB
mongoose.connect("mongodb+srv://admin-babak:test-1234@database.ithr0wo.mongodb.net/mvp");



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
