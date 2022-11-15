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

```bash
npm install
```

```bash
node app.js
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
| Get all items registred to a cardnumber | Get          | http://localhost:8080/card/:card_number       | b                                                              | JSON data, a list of items registred the cardnumber                                                                        |
| Get data when search on store           | Get          | http://localhost:8080/store/:store_name       | b                                                              | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on location        | Get          | http://localhost:8080/location/:location_name | b                                                              | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on month and year  | Get          | http://localhost:8080/month/month_month       | b                                                              | JSON data with name, categories, price,store,location                                                                      |
| Get data when search on date            | Get          | http://localhost:8080/day/:date               | b                                                              | JSON data with name, categories, price,store,location                                                                      |
| Delete all data on with a cardnumber    | Delete       | http://localhost                              |
