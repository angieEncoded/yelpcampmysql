require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./util/AppError");
const camgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const session = require("express-session");
// const mySqlStore = require("express-mysql-session")(session);
// const db = require("./util/database")

// const sessionStore = new mySqlStore({
//   clearExpired: true,
//   checkExpirationInterval: 86400000,
//   expiration: 86400000,
//   createDatabaseTable: true,
// }, db);


// ejs setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// additional helpers
app.use(morgan("tiny"));
app.use(session({
  secret: process.env.SECRET || 'shutupnode',
  /*store: sessionStore,*/
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}));




app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// serve static assets
app.use(express.static(path.join(__dirname, "public")))


// Routes - we can use the pattern prefix in this place so we don't have to use it in the route file

app.use("/campgrounds", camgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

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

app.listen(process.env.PORT, () => { });
