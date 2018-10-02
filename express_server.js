const express = require('express');
const bodyParser = require('body-parser'); //allows us to access POST request parameters
const app = express();
const PORT = 8080; //default port

const db = require("./database");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// GETS
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Handler that redirects based on a given id parameter
app.get("/u/:id", (req, res) => {
 let templateVars = {single: db.byShort(req.params.id)};
 console.log(`Attempting to redirect to ${templateVars.single.long}...`);
 res.status(301);
 res.redirect(templateVars.single.long);
});

app.get("/urls/:id", (req, res) => {
  console.log(`Request at id: ${req.params.id}`);
  let templateVars = {single: db.byShort(req.params.id)};
  console.log(`Requested object: ${templateVars.single.long} - ${templateVars.single.short}`);
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  let templateVars = { urls: db.all() };
  res.json(templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: db.all() };
  res.render("urls_index", templateVars); //passing urlDatabase to urls_index.ejs
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b> </body></html>");
});

// POSTS
app.post("/urls", (req, res) => { // Catches POST requests made to /urls
  console.log(req.body); // show POST parameters
  console.log(generateRandomKey());
  res.send("Ok!");
});

// LISTENS
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// FUNCTIONS
function generateRandomKey () {
  let key = "";
  for(let i = 0; i < 6; i++)
  {
    let digit = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    console.log(digit);
    key += String.fromCharCode(digit).toLowerCase();
  }
  return key;
}