# Shopify Backend Internship project fall 2022

This application is made based on this [requirments](https://docs.google.com/document/d/19WMSrMWsiB2itu9nUscfilNJTQlFXmTQpi-Q9-CHRbg/edit?usp=sharing)

It is an app for inventory managment.
## Link to run the app on Replit:
https://replit.com/@babakabdzadeh/inventory?v=1



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

#### **API**:

| Endpoint       | Type           | Description  |
| ------------- |:-------------:| -----:|
| /api/inventory      | GET |  | fetches all data |
| /api/inventory     | POST      |   create a new item|
| /api/inventory/{id} | PUT      |   updated item, (id required) |
| /api/inventory/{id}/{comment}| DELETE | delete an Item and info and comment in deleted item collection | 


