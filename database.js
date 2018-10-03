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
  getOne: (id, short) => db[id][short],
  add: (id, short, long) => { db[id][short] = long},
  delete: (id, short) => { delete db[id][short]},
  owner: (short) => {
    for (let thing in db) {
      // console.log(db[thing]);
      for (let tag in db[thing]) {
        if (tag == short) {
          return thing;
        }
      }
    }
    return null;
  }
};