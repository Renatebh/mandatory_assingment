const sqlite3 = require("sqlite3").verbose();
const express = require("express");

const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");
const http = require("http");
const hostname = "localhost";
const port = process.env.PORT || 8080;
// const { v4: uuidv4 } = require("uuid");
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());

// MAKING DB FILE
const db = new sqlite3.Database("./database/users.db");

// CATEGORYS USER MUST CHOSE FROM
const categorys = {
  categoryOne: "Beverages",
  categoryTwo: "Bakery",
  categoryTree: "Dairy",
  categoryFour: "Meat",
  categoryFive: "Veggies",
};

app.get("/", (req, res) => {
  res.send(categorys);
});

let items = [];

app.post("/item", (req, res) => {
  const item = req.body;

  items.push(item);
  console.log(items);
  res.send(`Item whith name ${item.name} added to the items array`);
});

app.get("/items", (req, res) => {
  res.send(items);
});

const CREATE_USERS = db.run(
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price INTEGER, cardnumber INTEGER)"
);

app.post("/card", (req, res) => {
  const card = req.body.cardnumber;

  items.forEach((item) => {
    item.cardnumber = card;
  });
  console.log("Items", items);

  db.run(CREATE_USERS, () => {
    res.send("Table created");
  });

  db.serialize(() => {
    db.run(
      db.run(
        "INSERT INTO users (name, category, price, cardnumber) VALUES ('" +
          name +
          "',  '" +
          category +
          "',  '" +
          price +
          "',  '" +
          cardnumber +
          "');"
      ),
      (err) => {
        if (err) {
          return console.log(err.message);
        }
        console.log("New user has been added");
        res.send("New user added");
        return res.json();
      }
    );
  });
});

server.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
