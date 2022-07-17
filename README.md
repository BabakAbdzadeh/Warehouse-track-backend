# inventory tracking (backend) 

## What does it do? 
It is an inventory tracking web application for a logistics company.



It is an app for inventory managment.
## Link to run the app on Replit:
https://replit.com/@babakabdzadeh/inventory?v=1
Basic CRUD Functionality:
 - Create inventory items
 - Edit Them
 - Delete Them
 - View a list of them
  Extra feature:
 - When deleting, allow deletion comments and undeletion


## Technologies:

- NodeJs
- ExpressJS
- EJS
- MongooseJS
- Lodash (js module)
      *lodash helps to save data and then search for them easier by manipulating string*
- MongoDB


## How does the application work

### **EJS**: 
Using `mongoose` to talk with database with `get` & `post` methods to render and get data from **EJS** files which is based on two different patterns: 
- looping on datas comming to **ejs** file
- sending data with submit buttons

### **db.js**:

this file contains the **Schema** and **model** for *items* and *deleted*

- **deleted** can be used later for showing deleted items with their **comments**


### **app.js**:

On the *app.js* side, each route has similiar name to their *EJS* file, due to the heavy load of work for university wasn't possible to edit them in proper way.

there is a function name `objectValidFinder` which loops through objects and save only `property:values` that exist in another `update` object.

- `app.post(delete)` does all the required functionality but I also added `deletedItem` document for lateron updates so then application shows all deleted items, now its possible only by direct commands from shell.

### **API**:

**api** is also written in app.js file.


| Endpoint       | Type           | Description  |
| :-------------: |:-------------:| :-----:|
| /api/inventory      | GET |   Fetches all data |
| /api/inventory/{id}      | GET |   search for item/s, required:{id} |
| /api/inventory     | POST      |   create a new item|
| /api/inventory/{id} | PUT      |   updated item, (id required) |
| /api/inventory/{id}/{comment}| DELETE | delete an Item and info and comment in deleted item collection | 

- Example for API:
 
     `curl --header "Content-Type: application/json" \
--request POST \ 
--data '{"barcode":"990008879","brand":"HTC"}' \ 
https://replit.com/@babakabdzadeh/inventory?v=1/api/inventory
`

Creates an Item with given barcode and brand. has to be *json*.
