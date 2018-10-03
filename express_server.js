const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); //allows us to access POST request parameters
const app = express();
const PORT = 8080; //default port

const db = require("./database");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

/* --- OBJECTS --- */

// Relocate this later to be more modular...

const users = {
  "15guys": {
    id: "15guys",
    email: "guy@example.com",
    password: "purple-monkey-dinosaur"
  },
 "myiddude": {
    id: "myiddude",
    email: "dude@example.com",
    password: "dishwasher-funk"
  }
};

/* --- GETS --- */

// Fetch the root page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Fetch the new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {username: req.cookies["username"]});
});

// Handler that redirects based on a given id parameter
app.get("/u/:id", (req, res) => {
 let templateVars = { single: db.byShort(req.params.id), username: req.cookies["username"] };
 res.status(301);
 res.redirect(templateVars.single.long);
});

// Show the urls_show page of a specific shortened URL
app.get("/urls/:id", (req, res) => {
  let templateVars = {single: db.byShort(req.params.id), username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// Shows all the urls in JSON format for debugging
app.get("/urls.json", (req, res) => {
  let templateVars = { urls: db.all(), username: req.cookies["username"] };
  res.json(templateVars);
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

// Passes all urls before loading url index
app.get("/urls", (req, res) => {
  let templateVars = { urls: db.all(), username: req.cookies["username"] };
  res.render("urls_index", templateVars); //passing urlDatabase to urls_index.ejs
});

// Marked for deletion !!
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b> </body></html>");
});

// Gets registration page
app.get("/register", (req, res) => {
  res.render("register");
});

/* ---- POSTS ----- */

// Post to login grabs username from request and returns a cookie
app.post("/login", (req, res) => {
  let user = req.body.username;
  res.cookie('username', user);
  res.redirect("/urls");
});

// Post to logout deletes the username cookie
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// Post to urls index first validates URL then adds the new url and key
app.post("/urls", (req, res) => {
  let long = validateURL(req.body.longURL);
  let short = generateRandomKey(6);
  db.add(long, short);
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  console.log(`Registered ${req.body.email} with pass ${req.body.password}!`);
  let newUserID = generateRandomKey(8);
  let newEmail = req.body.email;
  let newPass = req.body.password;
  users[newUserID] = {id: newUserID, email: newEmail, password: newPass};
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

/* ---- LISTEN TO PORT ----- */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

/* ---- FUNCTIONS ----- */

// Generates 6 digit key
function generateRandomKey (length) {
  let key = "";
  let cap = false;
  for(let i = 0; i < length; i++)
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

// Ensures new and updated URLs can make valid requests
function validateURL (string) {
  if (!string.includes("http://") && !string.includes("https://"))
  {
    return 'http://' + string;
  } else {
    return string;
  }
}