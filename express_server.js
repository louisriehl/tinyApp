const express = require('express');
const app = express();
const PORT = 8080; //default port

const db = require("./database");

app.set("view engine", "ejs");

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

app.get("/urls/:id", (req, res) => {
  console.log(`Request at id: ${req.params.id}`);
  let templateVars = {single: db.byShort(req.params.id)};
  console.log(`Requested object: ${templateVars.single.long} - ${templateVars.single.short}`);
  res.render("urls_show", templateVars);
});

app.get("/urls/:id/red", (req, res) => {
 let templateVars = {single: db.byShort(req.params.id)};
 console.log(`Attempting to redirect to ${templateVars.single.long}...`);
 res.redirect(templateVars.single.long);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b> </body></html>");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});