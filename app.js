require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./util/AppError");
const camgroundRoutes = require("./routes/campgrounds");
const session = require("express-session");
const sessionOptions = require("./util/SessionOptions");
// const flash = require("connect-flash");

// ejs setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// additional helpers
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.messages = req.flash("success");
//   next();
// });

// Routes - we can use the pattern prefix in this place so we don't have to use it in the route file
app.use("/campgrounds", camgroundRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// Catch all route
app.all("*", (req, res, next) => {
  next(new AppError("That page does not exist.", 404));
});

// General use error route
app.use((err, req, res, next) => {
  // Handle the case where there is no error message
  if (!err.message) {
    err.message = "Unknown error occured";
  }
  // Handle if we somehow managed to get by all the validation
  if (err.message.includes("CONSTRAINT")) {
    err.message = "Database constraint violated";
  }

  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { error: err });
});

app.listen(process.env.PORT, () => {});
