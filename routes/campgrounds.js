const express = require("express");
const router = express.Router();
const Campground = require("../models/Campground.js");
const Review = require("../models/Reviews");
const catchAsyncErrors = require("../util/catchAsyncErrors");
const validate = require("../util/ValidationHelpers");
const AppError = require("../util/AppError");



// GET /campgrounds
router.get("/", catchAsyncErrors(async (req, res, next) => {
  const [rows, metadata] = await Campground.getAllCampgrounds();
  res.render("campgrounds/index", { campgrounds: rows });
})
);

// GET /campgrounds/new (display form)
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// POST /campgrounds (create)
router.post("/", validate.validateCampgrounds, catchAsyncErrors(async (req, res, next) => {
  console.log("here")
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


// GET /campgrounds/:id (show)
router.get("/:id", catchAsyncErrors(async (req, res, next) => {
  const [rows, metadata] = await Campground.getCampgroundAndReviewsById(
    req.params.id
  );
  if (!rows.length) {
    return next(new AppError("That campground does not exist", 404));
  }
  res.render("campgrounds/show", { campground: rows });
})
);

// GET /campgrounds/:id/edit (display form)
router.get("/:id/edit", catchAsyncErrors(async (req, res, next) => {
  const [rows, metadata] = await Campground.getCampgroundByID(
    Number(req.params.id)
  );
  res.render("campgrounds/edit", { campground: rows[0] });
})
);

// PUT /campgrounds/:id
router.put("/:id", validate.validateCampgrounds, catchAsyncErrors(async (req, res, next) => {
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


// DELETE /campgrounds/:id (delete)
router.delete("/:id", catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  await Campground.deleteById(id);
  res.redirect("/campgrounds");
})
);

module.exports = router;
