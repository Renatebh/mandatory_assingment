const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const moment = require("moment");
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
  console.log(item);
  items.push(item);
  console.log(items);
  res.send(`Item whith name ${item.name} added to the items array`);
});

app.get("/items", (req, res) => {
  res.send(items);
});

// db.run(
//   "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price INTEGER, cardnumber INTEGER, store TEXT, location TEXT, date TEXT  )"
// );

app.post("/card", (req, res) => {
  const card = req.body.cardnumber;
  const store = req.body.store;
  const location = req.body.location;
  let date = moment().format("DD.MM.YY");

  items.forEach((item) => {
    item.cardnumber = card;
  });

  items.forEach((item) => {
    item.store = store;
  });

  items.forEach((item) => {
    item.location = location;
  });

  console.log("Items", items);
  res.send(`Card with cardnumber ${card} added`);

  items.map((item) => {
    let name = item.name;
    let category = item.category;
    let price = item.price;
    let cardnumber = item.cardnumber;
    // let location = item.location;
    // let store = item.store;
    // let date = item.newDate;

    db.serialize(() => {
      db.each(
        "INSERT INTO users (name, category, price, cardnumber, store, location, date) VALUES ('" +
          name +
          "',  '" +
          category +
          "',  '" +
          price +
          "',  '" +
          cardnumber +
          "', '" +
          location +
          "', '" +
          store +
          "', '" +
          date +
          "');"
      ),
        (err) => {
          if (err) {
            return console.log(err.message);
          }
          console.log("New user has been added");
          res.send("New user added");
          return res.json();
        };
    });
  });
});

app.get("/card/:card_number", (req, res) => {
  let data = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE cardnumber = ?;",
      [req.params.card_number],
      (err, row) => {
        if (err) {
          res.send("Error occur while updating");
          return console.error(err.message);
        }
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

// GET DATA BY DATE DD.MM.YY
app.get("/day/:date", (req, res) => {
  let data = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE date = ?;",
      [req.params.date],
      (err, row) => {
        if (err) {
          res.send("Error occur while updating");
          return console.error(err.message);
        }
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

app.get("/month/:month_number/:year_number", (req, res) => {
  let data = [];
  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE date = ?;",
      [req.params.mont.month_number.year_number],
      (err, row) => {
        if (err) {
          res.send("Error occur while updating");
          return console.error(err.message);
        }
        data.push(row);
      },
      () => {
        res.send(data);
      }
    );
  });
});

server.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
