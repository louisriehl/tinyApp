const db = {
  "15guys": {
    b2xVn2: "http://www.lighthouselabs.ca",
    s9m5xK: "http://www.google.com",
    ba985d: "https://www.example.com"
  },
  "myiddude": {
    basgtq: "http://www.amazon.ca"
  }
};

module.exports = {
  all: () => db,
  userURL: (id) => db[id],
  add: (id, short, long) => { db[id][short] = long}
};