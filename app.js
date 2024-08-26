const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://localhost:27017/ContactForm";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("I am root");
});

//index Route
app.get("/user", async (req, res) => {
  const allUser = await User.find({});
  res.render("user.ejs", { allUser });
});

//New Route
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

//show Route
app.get("/user/:id", async (req, res) => {
  let userId = req.params.id.trim();
  const user = await User.findById(userId);
  res.render("show.ejs", { user });
});

//Create Route

app.post("/user", async (req, res) => {
  const newUser = new User(req.body.user);
  await newUser.save();
  res.redirect("/user");
});

//Delete Route
app.delete("/user/:id", async (req, res) => {
  let userId = req.params.id.trim();
  let deletedUser = await User.findByIdAndDelete(userId);
  console.log(deletedUser);
  res.redirect("/user");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
