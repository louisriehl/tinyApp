const express = require('express');
const app = express();
const PORT = 8080; //default port

const db = require("./database");

app.set("view engine", "ejs");

//database of temporary keys
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  let templateVars = { urls: db.all() };
  res.json(templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: db.all() };
  res.render("urls_index", templateVars); //passing urlDatabase to urls_index.ejs
});

app.get("/urls:id", (req, res) => {
  let templateVars = {shortURL: req.params.id};
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b> </body></html>");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});