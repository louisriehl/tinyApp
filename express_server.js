const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); //allows us to access POST request parameters
const app = express();
const PORT = 8080; //default port

const db = require("./database");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

/* --- GETS --- */
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies["username"]});
});

// Handler that redirects based on a given id parameter
app.get("/u/:id", (req, res) => {
 let templateVars = { single: db.byShort(req.params.id), username: req.cookies["username"] };
 // console.log(`Attempting to redirect to ${templateVars.single.long}...`);
 res.status(301);
 res.redirect(templateVars.single.long);
});

// Show the urls_show page of a specific shortened URL
app.get("/urls/:id", (req, res) => {
  // console.log(`Request at id: ${req.params.id}`);
  let templateVars = {single: db.byShort(req.params.id), username: req.cookies["username"] };
  // console.log(`Requested object: ${templateVars.single.long} - ${templateVars.single.short}`);
  res.render("urls_show", templateVars);
});

// Shows all the urls in JSON format for debugging
app.get("/urls.json", (req, res) => {
  let templateVars = { urls: db.all(), username: req.cookies["username"] };
  res.json(templateVars);
});

// Passes all urls before loading url index
app.get("/urls", (req, res) => {
  let templateVars = { urls: db.all(), username: req.cookies["username"] };
  res.render("urls_index", templateVars); //passing urlDatabase to urls_index.ejs
});

// Root page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b> </body></html>");
});

/* ---- POSTS ----- */

app.post("/login", (req, res) => {
  let user = req.body.username;
  res.cookie('username', user);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => { // Catches POST requests made to /urls
  let long = validateURL(req.body.longURL); // show POST parameters
  let short = generateRandomKey();
  console.log(`The new url is ${long} and the key is ${short}`);
  db.add(long, short);
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  let idToDelete = db.index(req.params.id);
  db.delete(idToDelete);
  console.log("Deleting...");
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  let update = validateURL(req.body.newLong);
  let id = db.index(req.params.id);
  db.update(id, update);
  res.redirect("/urls");
});

// LISTENS
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// FUNCTIONS
function generateRandomKey () {
  let key = "";
  let cap = false;
  for(let i = 0; i < 6; i++)
  {
    let digit = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    if (cap){
      key += String.fromCharCode(digit);
    } else {
      key += String.fromCharCode(digit).toLowerCase();
    }
    cap = !cap;
  }
  return key;
}

function validateURL (string) {
  if (!string.includes("http://") && !string.includes("https://"))
  {
    return 'http://' + string;
  } else {
    return string;
  }
}