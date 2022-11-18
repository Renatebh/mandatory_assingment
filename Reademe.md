# Mandatory assignment in Node.js

This assingment is made for Stortinget. They wanted a new purschase tracking system. I've built an API to support this.

## What this API does

- Adding items to an array that's stored in local memory. If the browser is reloaded the array will empty.
- When the user is going to pay, the system will get the items from the array and adds it to the credit card that the user paid with. It will also take in store and location.

- When the user has paid the system will store the information in the user.db.
- The database table user has the columns of name, category, price, cardnumber, store, location and date. It will also automaticly add an id to each of the items.

* With this API you can get, post, delete on spesific endpoints.

## How to use this API

You must install node on your computer. If you don't have it you can download it [here](https://nodejs.org/en/download/).

Node moduls must be reinstalled, and is important to make a node install in the terminal so you get the dependencies that are required for this prosject.

You can use [Postman](https://www.postman.com/), or any other program, to send data from browswer to api. Postman is the "frontend" in this project and it's easier if you've it installed. But you can also use the browser as well.

To start this application run these commands in your terminal:

```bash
npm install
```

```bash
npm start
```

| Name                                    | Request type | Endpoints                                     | Body                                                           | Response                                                                                                                   |
| --------------------------------------- | ------------ | --------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Get category                            | Get          | http://localhost:8080                         |                                                                | categorys = {"beverage", "bakery", "dairy", "meat", "veggies", "fruit", "cleaners", "sweets", "other"}.                    |
| Post items                              | Post         | http://localhost:8080/item                    | {"name": "item-name", "category":"categorys", "price":"price"} |
| Get items from array                    | Get          | http://localhost:8080/items                   |                                                                | An array of items                                                                                                          |
| Post cardnumber, store, location        | Post         | http://localhost:8080/card                    | {"cardnumber":"1234", "store":"Kiwi","location":"Sandefjord"}  | {"name": "item-name", "category":"categorys", "price":"price","cardnumber":"1234", "store":"Kiwi","location":"Sandefjord"} |
| Get all items registred to a cardnumber | Get          | http://localhost:8080/card/:card_number       |                                                                | JSON data, a list of items registred the cardnumber                                                                        |
| Get data when search on store           | Get          | http://localhost:8080/store/:store_name       |                                                                | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on location        | Get          | http://localhost:8080/location/:location_name |                                                                | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on month and year  | Get          | http://localhost:8080/month/month_month       |                                                                | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on date            | Get          | http://localhost:8080/day/:date               |                                                                | JSON data with name, categories, price,store,location                                                                      |
| Delete all data on with a cardnumber    | Delete       | http://localhost:8080/card/:card_number       |                                                                | JSON data with name, categories, price,store,location                                                                      |

## Dependencies used in this assingment

- Express:
  Express is a Node.js web framework that provides a set of features for web and mobile applications.
- Sqlite 3:
  I’m using SQLITE 3 to make my database for this project. It’s a database that doesn’t require a seperate server. Verbose is for debbugging. The mode is set to verbose to produce long stack traces. When you throw an error from a callback passed to any of the database functions, node-sqlite3 will append the stack trace information from the original call.
- Body-parser:
  It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data over an HTTP request body. I used body-parser for parsing JSON data.

- Moment:
  Parse, validate, manipulate, and display dates and times in JavaScript. I used it for parse in date in the format "DD.MM.YY".

- Nodemon: For development, nodemon is starting the server when changes are made.
