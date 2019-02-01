const express = require("express");
const app = express();
const mongoose = require("mongoose");

const users = require("./routes/api/users").router;
const profiles = require("./routes/api/profile").router;
const posts = require("./routes/api/posts").router;

app.get("/", (req, res) => res.send("Hello world"));

//DB config
const db = require("./config/keys").mongoURI;

// Connect to mongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.log(error));

//Use routes

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/profile", profiles);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = {
  app
};
