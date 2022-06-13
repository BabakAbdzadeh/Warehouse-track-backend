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

**EJS**: 
Using `mongoose` to talk with database and `get` & `post` method to render and get data from **EJS** files which is based on two different patterns: 
- looping on datas comming to **ejs** file
- sending data with submit buttons

On the *app.js** side, each route has similiar name to their *EJS* file, due to the heavy load of work for university wasn't possible to edit them in proper way.

there is a function name `objectValidFinder` which loops through objects and save only `property:values` that exist in another `update` object.


