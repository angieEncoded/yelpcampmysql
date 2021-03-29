require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const Campground = require("./models/Campground.js");

// ejs setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// additional helpers
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Campgrounds routes - learning new async syntax
/* -------------------------------------------------------- */
// GET /campgrounds (index)
app.get("/campgrounds", async (req, res) => {
  const [rows, metadata] = await Campground.getAllCampgrounds();
  res.render("campgrounds/index", { campgrounds: rows });
});

// GET /campgrounds/new (display form)
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// POST /campgrounds (create)
app.post("/campgrounds", async (req, res) => {
  const details = req.body.campground;
  const newCamp = new Campground(
    null,
    details.title,
    details.image,
    parseFloat(details.price),
    details.description,
    details.location
  );

  const result = await newCamp.save();
  res.redirect(`/campgrounds/${result[0].insertId}`);
});

// GET /campgrounds/:id/edit (display form)
app.get("/campgrounds/:id/edit", async (req, res) => {
  const [rows, metadata] = await Campground.getCampgroundByID(req.params.id);
  res.render("campgrounds/edit", { campground: rows[0] });
});

// PATCH /campgrounds/:id
app.put("/campgrounds/:id", async (req, res) => {
  let campground = req.body.campground;
  const [rows, metadata] = await Campground.getCampgroundByID(req.params.id);
  const updatedCampground = new Campground(
    rows[0].id,
    campground.title,
    campground.image,
    Number(campground.price),
    campground.description,
    campground.location
  );
  await updatedCampground.update();
  res.redirect(`/campgrounds/${rows[0].id}`);
});

// GET /campgrounds/:id (show)
app.get("/campgrounds/:id", async (req, res) => {
  const [rows, metadata] = await Campground.getCampgroundByID(req.params.id);
  // console.log(rows); // Remember to pull the first item from the array
  res.render("campgrounds/show", { campground: rows[0] });
});

// DELETE /campgrounds/:id (delete)
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.deleteById(id);
  res.redirect("/campgrounds");
});

/* -------------------------------------------------------- */

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
