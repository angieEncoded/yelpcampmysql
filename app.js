require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const AppError = require("./util/AppError");
const camgroundRoutes = require("./routes/campgrounds");
const cookieParser = require("cookie-parser");
// ejs setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// additional helpers
app.use(cookieParser(process.env.SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Routes - we can use the pattern prefix in this place so we don't have to use it in the route file
app.use("/campgrounds", camgroundRoutes);

app.get("/greet", (req, res, next) => {
  const { name = "anonymous" } = req.cookies;
  console.log(req.cookies);
  res.send(`Hey there, ${name}`);
});

// We can send a cookie with res.cookie() method
app.get("/setname", (req, res, next) => {
  res.cookie("name", "Bablet");
  res.cookie("Animal", "Cat");
  res.send("Ok, sent the cookie");
});

// Using signed cookies
app.get("/getsignedcookie", (req, res, next) => {
  res.cookie("fruit", "grape", { signed: true });
  res.send("Okay, signed the cookie");
});

app.get("/verifyfruit", (req, res, next) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  // res.send(req.cookies);
  res.send(req.signedCookies);
});

app.get("/", (req, res) => {
  res.render("home");
});

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
