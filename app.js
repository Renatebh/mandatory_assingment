/*
 * Copyright Renate Hem
 */

const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const moment = require("moment");
const bodyParser = require("body-parser");

const hostname = "localhost";
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database("./database/users.db");

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
  if (!categorys) {
    return res.status(400).json({ error: "No data" });
  }
  res.send(categorys);
});

/*
 * POST ITEMS IN THE ITEMS ARRAY, IT RETURNS A CHECK IF YOU HAVE ADDED ITEMS WITH THE RIGHT CATEGORY. IF YOU DONT CHOOSE RIGHT CATEGORY, ITEMS WILL NOT BE PUSHED INTO ITEMS ARRAY.
 */
let items = [];

app.post("/item", (req, res) => {
  const item = req.body;

  let category = req.body.category;

  if (categorys.includes(category.toLowerCase()) || category === "") {
    items.push(item);
    res.send(`Item whith name ${item.name} added to the items array`);
  } else if (!categorys) {
    return res.status(404).json({ error: "No data" });
  } else {
    res.send(`You must chose a category from list or leave it blank`);
    return;
  }
});

//! Development endpoint, Only for checking if the items exists, returning the array of items.
app.get("/items", (req, res) => {
  res.send(items);
});

// ** CREATING TABLE CALLED USERS
db.run(
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, price INTEGER NOT NULL, cardnumber INTEGER NOT NULL, store TEXT NOT NULL, location TEXT NOT NULL, date TEXT NOT NULL  )"
);

// * THIS ENDPIONT IS ADDING MORE INFORMATION ON THE ITEMS: CARDNUMBER, STORE AND LOCATION. IM ADDING IT TO THE ARRAY BEFORE IT'S PUSHED INTO THE DATABASE. IF ITEMS ARRAY IS EMPTY IT WILL RETURN A MESSAGE THAT IT IS AND IT WILL NOT BE PUSHED, OTHERWISE IT WILL RETURN A MESSAGE THAT ITEMS IS PAID FOR. (201)
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
      );
    });
  });

  if (items.length === 0) {
    return res.status(404).send("Items array is empty, you must add Items");
  } else {
    items = [];
    return res.status(201).send("Items paid! Thank you..");
  }
});

/*
 * -GET DATA FROM TABLE BY CARD NUMBER - 4 DIGITS - RETURNING (name, store, location, cardnumber) DATA FROM A CARDNUMBER, OR A MESSAGE SAYING CARDNUMBER DON'T EXIST.
 */
app.get("/card/:card_number", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT name, store, location, cardnumber FROM users WHERE cardnumber = ?;",
      req.params.card_number,
      (err, row) => {
        if (err) {
          return res.status(404).json({ error: "Error occur" });
        }
        data.push(row);
      },

      () => {
        let cardData = [];

        data.map((card) => {
          cardData = card.cardnumber;
        });

        if (cardData != parseInt(req.params.card_number)) {
          return res
            .status(404)
            .json({ error: "Cardnumber does not exists in database" });
        }

        return res.send(data);
      }
    );
  });
});

/*
 * GET DATA BY STORE NAME, RETURNS AN ARRAY OFF DATA REGISTRED TO THAT STORE. I USED MAP TO COMPARE THE VALUES IN STOREDATA AND STORENAME AND TO CHECK IF STORENAME EXITS, FOR WRITING THE IF STATMENT.
 */
app.get("/store/:store_name", (req, res) => {
  let data = [];
  let storeName = req.params.store_name;

  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE store LIKE '" + storeName + "%';",
      (err, row) => {
        if (err) {
          return res.status(404).json({ error: "Error occur" });
        }
        data.push(row);
      },

      () => {
        let storeData = [];

        data.map((store) => {
          storeData = store.store;
        });

        if (storeData.includes(storeName)) {
          return res.send(data);
        } else
          return res
            .status(404)
            .json({ error: "Store does not exists in database" });
      }
    );
  });
});

// * GET DATA FROM A LOCATION RETURNING AN ARRAY OF ITEMS BOUGHT ON THAT LOCATION
app.get("/location/:location_name", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE location = ?;",
      [req.params.location_name],
      (err, row) => {
        if (err) {
          return res.status(404).json({ error: "Error occur" });
        }
        data.push(row);
      },

      () => {
        let locationData = [];

        data.map((location) => {
          locationData = location.location;
        });

        if (locationData === req.params.location_name) {
          return res.send(data);
        }
        return res
          .status(404)
          .json({ error: "Location does not exists in database" });
      }
    );
  });
});

/*
 * GET DATA BY DATE DD.MM.YY - RETURNING ALL ITEMS BOUGHT ON THAT DAY - RETURNING AN MESSAGE IF DATE DONT'T EXIST
 */
app.get("/day/:date", (req, res) => {
  let data = [];

  db.serialize(() => {
    db.each(
      "SELECT * FROM users WHERE date = ?;",
      [req.params.date],
      (err, row) => {
        if (err) {
          return res.status(404).json({ error: "Error occur" });
        }
        data.push(row);
      },
      () => {
        let dateData = [];

        data.map((date) => {
          dateData = date.date;
        });

        if (dateData === req.params.date) {
          return res.send(data);
        }
        return res
          .status(404)
          .json({ error: "Date does not exists in database" });
      }
    );
  });
});

// * GET DATA BY MONTH AND YEAR - RETURNING ALL DATA BOUGTH IN ONE MONTH AND YEAR. CHECK IF DATE EXISTS - RETURNS A MESSAGE IF DATE NOT FOUND
app.get("/month/:month_number/:year_number", (req, res) => {
  let data = [];
  let month = req.params.month_number;
  let year = req.params.year_number;

  db.serialize(() => {
    db.each(
      `SELECT * FROM users WHERE date LIKE '%${month}.${year}';`,

      (err, row) => {
        if (err) {
          return res.sendStatus(404).res.send("Error occur");
        }
        data.push(row);
      },
      () => {
        let monthYearData = [];
        data.map((date) => {
          monthYearData = date.date;
        });

        if (monthYearData.includes(month + "." + year)) {
          res.send(data);
        }
        return res
          .status(404)
          .json({ error: "Month and year does not exists in database" });
      }
    );
  });
});

// * DELETE DATA FROM A CARDNUMBER - RETURNING "DATA DELETED" OR 400 IF IT IS A BAD REQ.
app.delete("/card/:card_number", (req, res) => {
  db.serialize(() => {
    db.run(
      "DELETE FROM users WHERE cardnumber = ?",
      req.params.card_number,

      (err) => {
        if (err) {
          return res.sendStatus(400);
        }
        res.send("Data deleted");
      }
    );
  });
});

// * CLOSE DATABASE
// ! Not a requirement
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

app.listen(port, hostname, () => {
  console.log(`server is running at http://${hostname}:${port}`);
});
