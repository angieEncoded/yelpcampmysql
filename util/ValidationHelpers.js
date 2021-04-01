const { campgroundSchema, reviewSchema } = require("./ValidationSchemas");
const AppError = require("./AppError");

module.exports.validateCampgrounds = (req, res, next) => {
  // Deal with validation using Joi (new, no longer using express-validator)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    console.log("in campgrounds")
    const message = error.details.map((element) => element.message).join(",");
    throw new AppError(message, 400);
  } else {
    next();
  }
};

module.exports.validateReviews = (req, res, next) => {
  // Deal with validation using Joi (new, no longer using express-validator)
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new AppError(message, 400);
  } else {
    next();
  }
};
