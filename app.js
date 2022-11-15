/*
 * Copyright Renate Hem
 *
 * This is the main entrypoint of my application
 */

const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const moment = require("moment");
const bodyParser = require("body-parser");

const http = require("http");
const hostname = "localhost";
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(express.json()); //THIS IS TO ACCEPT JSON FORMAT

// MAKING DB FILE
const db = new sqlite3.Database("./database/users.db");

// CATEGORYS ARRAY USER MUST CHOSE FROM
const categorys = [
  "beverage",
  "bakery",
  "dairy",
  "meat",
  "veggies",
  "fruit",
  "cleaners",
  "sweets",
  "other",
];

app.get("/", (req, res) => {
  res.send(categorys);
});

let items = [];

app.post("/item", (req, res) => {
  const item = req.body;

  let category = req.body.category;

  if (categorys.includes(category.toLowerCase()) || category === "") {
    items.push(item);
    res.send(`Item whith name ${item.name} added to the items array`);
  } else {
    res.send(`You must chose a category from list or leave it blank`);
    return;
  }
  console.log(items);
});

// GET ITEMS FROM ITEMS(array)
app.get("/items", (req, res) => {
  res.send(items);
});

db.run(
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price INTEGER, cardnumber INTEGER, store TEXT, location TEXT, date TEXT  )"
);

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

  console.log(
    "Items added to database with card/store/location information",
    items
  );
  res.send(items);

  items.map((item) => {
    let name = item.name;
    let category = item.category;
    let price = item.price;
    let cardnumber = item.cardnumber;

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
          store +
          "', '" +
          location +
          "', '" +
          date +
          "');"
      ),
        (err) => {
          if (err) {
            res.send("Error occur while adding to database");
            return console.log(err.message);
          }
          console.log("New user has been added");
          res.send("New user added");
          return res.json();
        };
    });
  });
});

// GET DATA (item-name only) BY CARD NUMBER - 4 DIGITS
app.get("/card/:card_number", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT name FROM users WHERE cardnumber = ?;",
      [req.params.card_number],
      (err, row) => {
        if (err) {
          res.send("Error occur while displaying card details");
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

app.get("/store/:store_name", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE store = ?;",
      [req.params.store_name],
      (err, row) => {
        if (err) {
          res.send("Error occur while displaying store details");
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

// GET DATA FROM A LOCATION
app.get("/location/:location_name", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE location = ?;",
      [req.params.location_name],
      (err, row) => {
        if (err) {
          res.send("Error occur while displaying store details");
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

// GET DATA BY MONTH AND YEAR
app.get("/month/:month_number/:year_number", (req, res) => {
  let data = [];
  let month = req.params.month_number;
  let year = req.params.year_number;

  db.serialize(() => {
    db.each(
      `SELECT * FROM users WHERE date LIKE '%${month}.${year}';`,

      (err, row) => {
        if (err) {
          res.send("Error occur");
          return console.error(err.message);
        }

        data.push(row);
        console.log("Data", data);
      },
      () => {
        res.send(data);
      }
    );
  });
});

// DELETE DATA FROM A CARDNUMBER
app.delete("/card/:card_number", (req, res) => {
  db.serialize(() => {
    db.run(
      "DELETE FROM users WHERE cardnumber = ?",
      req.params.card_number,

      (err) => {
        if (err) {
          res.sendStatus(404);
          return console.error(err.message);
        }
        res.sendStatus(204);

        console.log("Data deleted");
      }
    );
  });
});

// CLOSE DATABASE
app.get("/close", (req, res) => {
  db.close((err) => {
    if (err) {
      res.send("There is some error in closing the database");
      return console.error(err.message);
    }
    console.log("Closing the database connection.");
    res.send("Database connection successfully closed");
  });
});

// // DELETE DATABASE
// app.delete("/delete_database", (req, res) => {
//   db.run((err) => {
//     if (err) {
//       res.send("There is some error in deleting the database");
//       return console.error(err.message);
//     }
//     `DROP TABLE users`;
//     console.log("Database deleted.");
//     res.send("Database is successfully deleted");
//   });
// });

server.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
