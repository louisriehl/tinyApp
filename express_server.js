/* --- DEPENDENCIES -- */
const express = require('express');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; //default port

/* --- EXPRESS CONFIG ---*/
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("views/media"));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["chocolatechip", "doublefudge", "snickerdoodle"]
}));

/* --- MODULES ---*/
const db = require("./database");

/* --- OBJECTS --- */

const users = {
  zPoPpHxQ: {
    id: "zPoPpHxQ",
    email: "myemail@mail.com",
    password: "$2b$10$kGu1gNQxZRwSD.K/9PiKHuKakCoowSBgMkaaPDUagLQR0VAEpLe7u"}
};

/* --- GET REQUESTS --- */

// Redirect from root page
app.get("/", (req, res) => {
  if(req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("login");
  }
});

// Fetch the new url page
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
  let currentID = req.session.user_id;
  res.render("urls_new", {user: users[currentID]});
  }
});

// Handler that redirects based on a given id parameter
app.get("/u/:id", (req, res) => {
  let short = req.params.id;
  let id = db.owner(short);
  if (!id) {
    let errorVars = { code: 404, message: "Not Found!"};
    res.render("error_page", errorVars).status(errorVars.code);
  }
  db.addVisit(id, short);
  if (!req.cookies[short]) {
    res.cookie(short, true);
    db.addUnique(id, req.params.id);
  }
  let destination = db.getOne(id, short);
  res.status(301);
  res.redirect(destination);
});

// Show the urls_show page of a specific shortened URL
app.get("/urls/:id", (req, res) => {
  let ownerID = db.owner(req.params.id);
  if (!ownerID) {
    let errorVars = { code: 404, message: "Not Found!"};
    res.render("error_page", errorVars).status(errorVars.code);
  }
  let currentID = req.session.user_id;
  let shortURL = req.params.id;
  if (ownerID == currentID)
  {
    let templateVars = {short: shortURL,
      long: db.getOne(currentID, shortURL),
      user: users[currentID],
      date: db.getDate(currentID, shortURL),
      visits: db.getVisits(currentID, shortURL),
      unique: db.getUniques(currentID, shortURL)};
    res.render("urls_show", templateVars);
  } else {
    let errorVars = { code: 404, message: "Not Found!"};
    res.render("error_page", errorVars).status(errorVars.code);
  }
});

// Passes all urls before loading url index
app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    let currentID = req.session.user_id;
    let templateVars = { urls: db.userURLs(currentID), user: users[currentID] || null };
    res.render("urls_index", templateVars); //passing urlDatabase to urls_index.ejs
  } else {
    let errorVars = { code: 401, message: "Not Authorized!"};
    res.render("error_page", errorVars).status(errorVars.code);
  }
});

// Gets registration page, redirect if user is logged in
app.get("/register", (req, res) => {
  if(req.session.user_id) {
  res.redirect("/urls").end();
  }
  res.render("register");
});

// Gets login page, redirect if user is logged in
app.get("/login", (req, res) => {
  if(req.session.user_id) {
    res.redirect("/urls").end();
  }
  res.render("login");
});

/* ---- POST REQUESTS ----- */

// Post to login grabs user_id from request and returns a cookie
app.post("/login", (req, res) => {
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;
  if (validateEmail(loginEmail) && validatePassword(loginEmail, loginPassword)) {
    let id = findIDFromEmail(loginEmail);
    req.session.user_id = id;
    res.redirect("/urls");
  } else {
    let errorVars = { code: 400, message: "Wrong Email or Password!"};
    res.status(errorVars.code);
    res.render("error_page", errorVars);
  }
});

// Post to logout deletes the user_id cookie
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/login");
});

// Post to urls index first validates URL then adds the new url and key
app.post("/urls", (req, res) => {
  if (!req.session.user_id)
  {
    let errorVars = { code: 401, message: "Not Authorized!"};
    res.render("error_page", errorVars).status(errorVars.code);
  } else {
    let long = validateURL(req.body.longURL);
    let short = generateRandomKey(8);
    let id = req.session.user_id;
    let date = dateParser();
    db.add(id, short, long, date);
    res.redirect("/urls");
  }
});

// Registers a new user
app.post("/register", (req, res) => {
  let newUserID = generateRandomKey(6);
  let newEmail = req.body.email;
  let newPass = bcrypt.hashSync(req.body.password, 10);
  if ( newEmail && newPass) {
    let invalid = false;
    for (let id in users) {
      if (users[id]['email'] == newEmail) {
        invalid = true;
      }
    }
    if(!invalid) {
      users[newUserID] = {id: newUserID, email: newEmail, password: newPass};
      db.newUser(newUserID);
      req.session.user_id = newUserID;
      res.redirect("/urls");
    } else {
    let errorVars = { code: 400, message: "Email already registered!"};
    res.render("error_page", errorVars).status(errorVars.code);
    }

  } else {
    let errorVars = { code: 400, message: "No email or password!"};
    res.status(errorVars.code);
    res.render("error_page", errorVars);
  }
});

// Deletes a given URL
app.post("/urls/:id/delete", (req, res) => {
  if(!req.session.user_id) {
    let errorVars = { code: 401, message: "Not Authorized!"};
    res.render("error_page", errorVars).status(errorVars.code);
  } else {
    let ownerID = db.owner(req.params.id);
    let currentID = req.session.user_id;
    let short = req.params.id;
    if (ownerID == currentID) {
      db.delete(currentID, short);
      res.redirect("/urls");
    } else {
    let errorVars = { code: 401, message: "Not Authorized!"};
    res.render("error_page", errorVars).status(errorVars.code);
    }
  }
});

// Updates a given URL
app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id || req.session.user_id != db.owner(req.params.id)) {
    let errorVars = { code: 401, message: "Not Authorized!"};
    res.render("error_page", errorVars).status(errorVars.code);
  } else {
    let date = dateParser();
    let long = validateURL(req.body.newLong);
    let short = req.params.id;
    let id = req.session.user_id;
    db.add(id, short, long, date);
    res.redirect("/urls");
  }
});

/* ---- LISTEN TO PORT ----- */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

/* ---- FUNCTIONS ----- */

// Generates key of given length
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

// Returns userID from their email address
function findIDFromEmail (email) {
  for (let id in users) {
    if (users[id]['email'] == email) {
      return users[id]['id'];
    }
  }
  return null;
}
// Checks validity of email address
function validateEmail (email) {
  for (let id in users) {
    if (users[id]['email'] == email) {
      return true;
    }
  }
  return false;
}
// Checks that email and password match correctly
function validatePassword (email, password) {
  let id = findIDFromEmail(email);
  if (bcrypt.compareSync(password, users[id]['password']))
  {
    return true;
  } else {
    return false;
  }
}

function dateParser () {
  let date = new Date();
  return date.toString().split(" ").slice(0,4).join(" ");
}
