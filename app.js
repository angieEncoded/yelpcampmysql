require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./util/AppError");
const Campground = require("./models/Campground.js");
const catchAsyncErrors = require("./util/catchAsyncErrors");
const Joi = require("joi");
const { join } = require("path");

// ejs setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// additional helpers
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Home page");
});

// Campgrounds routes - learning new async syntax
/* -------------------------------------------------------- */
// GET /campgrounds (index)
app.get(
  "/campgrounds",
  catchAsyncErrors(async (req, res, next) => {
    const [rows, metadata] = await Campground.getAllCampgrounds();
    res.render("campgrounds/index", { campgrounds: rows });
  })
);

// GET /campgrounds/new (display form)
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// POST /campgrounds (create)
app.post(
  "/campgrounds",
  catchAsyncErrors(async (req, res, next) => {
    // Deal with validation using Joi (new, no longer using express-validator)
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: join.string().required(),
        location: Joi.string().required(),
      }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new AppError(message, 400);
    }

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
  })
);

// GET /campgrounds/:id/edit (display form)
app.get(
  "/campgrounds/:id/edit",
  catchAsyncErrors(async (req, res, next) => {
    const [rows, metadata] = await Campground.getCampgroundByID(
      Number(req.params.id)
    );
    res.render("campgrounds/edit", { campground: rows[0] });
  })
);

// PATCH /campgrounds/:id
app.put(
  "/campgrounds/:id",
  catchAsyncErrors(async (req, res, next) => {
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
  })
);

// GET /campgrounds/:id (show)
app.get("/campgrounds/:id", async (req, res, next) => {
  const [rows, metadata] = await Campground.getCampgroundByID(req.params.id);
  if (!rows.length) {
    return next(new AppError("That campground does not exist", 404));
  }
  res.render("campgrounds/show", { campground: rows[0] });
});

// DELETE /campgrounds/:id (delete)
app.delete(
  "/campgrounds/:id",
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    await Campground.deleteById(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new AppError("That page does not exist.", 404));
});

app.use((err, req, res, next) => {
  // Handle the case where there is no error message
  if (!err.message) {
    err.message = "Unknown error occured";
  }
  // Handle if we somehow managed to get by all the validation
  if (err.message.includes("CONSTRAINT")) err = handleConstraintError(err);

  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { error: err });
});

app.listen(process.env.PORT, () => {});
