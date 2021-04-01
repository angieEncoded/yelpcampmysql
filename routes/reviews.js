const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Reviews");
const catchAsyncErrors = require("../util/catchAsyncErrors");
const validate = require("../util/ValidationHelpers");

// Reviews routes below here
// /campgrounds/:id/reviews
router.post("/", validate.validateReviews, catchAsyncErrors(async (req, res, next) => {
  console.log("got to the route")
  const id = req.params.id;
  console.log(req.params);
  const reviewDetails = req.body.review;
  const username = "josie"; // hard code a username until sessions
  const review = new Review(null, reviewDetails.rating, reviewDetails.details, id, username);
  await review.save();
  res.redirect(`/campgrounds/${id}`);
})
);

// delete review /campgrounds/:id/reviews/:reviewId
router.delete("/:reviewId", catchAsyncErrors(async (req, res, next) => {
  // console.log(req.params.reviewId);
  await Review.deleteById(req.params.reviewId);
  res.redirect(`/campgrounds/${req.params.id}`);
})
);

module.exports = router;
