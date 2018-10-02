const express = require('express');
const app = express();
const PORT = 8080; //default port

//database of temporary keys
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>world!</b></body></html>");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});