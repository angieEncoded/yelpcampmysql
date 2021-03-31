const { campgroundSchema } = require("./ValidationSchemas");
const AppError = require("./AppError");
// Function to validate campgrounds. Reaches out to /util/ValidationSchema to get the
// pattern to match
const validateCampgrounds = (req, res, next) => {
  // Deal with validation using Joi (new, no longer using express-validator)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((element) => element.message).join(",");
    throw new AppError(message, 400);
  } else {
    next();
  }
};

module.exports = validateCampgrounds;
