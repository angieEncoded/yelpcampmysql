require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const Campground = require("./models/Campground.js");

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", (req, res) => {
  // For mysql model just do Campground(id, titledata, pricedata, descriptiondata, location, data)
  // If using autoincrement in the database use null for the first item
  const newCampground = new Campground(
    null,
    "Test",
    10.59,
    "this is a test item",
    "California"
  );
  newCampground.save();

  console.log(newCampground);

  //campground.save();
  res.send("Success!");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
