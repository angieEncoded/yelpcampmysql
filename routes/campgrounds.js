const express = require("express");
const router = express.Router();
const Campground = require("../models/Campground.js");
const catchAsyncErrors = require("../util/catchAsyncErrors");
const validateCampgrounds = require("../util/ValidateCampgrounds");

router.use((req, res, next) => {
  if (req.query.isAdmin) {
    next();
  } else {
    res.send(
      "Sorry, my middleware fake auth is preventing you from getting through - use ?isAdmin=true at the end of the url to get in!"
    );
  }
});

router.get(
  "/",
  catchAsyncErrors(async (req, res, next) => {
    const [rows, metadata] = await Campground.getAllCampgrounds();
    res.render("campgrounds/index", { campgrounds: rows });
  })
);

// GET /campgrounds/new (display form)
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// POST /campgrounds (create)
router.post(
  "/",
  validateCampgrounds,
  catchAsyncErrors(async (req, res, next) => {
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
router.get(
  "/:id/edit",
  catchAsyncErrors(async (req, res, next) => {
    const [rows, metadata] = await Campground.getCampgroundByID(
      Number(req.params.id)
    );
    res.render("campgrounds/edit", { campground: rows[0] });
  })
);

// PATCH /campgrounds/:id
router.put(
  "/:id",
  validateCampgrounds,
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
router.get("/:id", async (req, res, next) => {
  const [rows, metadata] = await Campground.getCampgroundByID(req.params.id);
  if (!rows.length) {
    return next(new AppError("That campground does not exist", 404));
  }
  res.render("campgrounds/show", { campground: rows[0] });
});

// DELETE /campgrounds/:id (delete)
router.delete(
  "/:id",
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    await Campground.deleteById(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
