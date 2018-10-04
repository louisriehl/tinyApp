const db = {
  "zPoPpHxQ": {
    b2xVn2: { long: "http://www.lighthouselabs.ca", date: "Wed May 21 1994", visits: 0},
    s9m5xK: { long: "http://www.google.com", date: "Mon Jan 01 2000", visits: 0 },
    ba985d: { long: "https://www.example.com", date: "Sat Jul 18 2077", visits: 0 }
  }
};

module.exports = {
  all: () => db,
  newUser: (id) => { db[id]= {}},
  userURLs: (id) => db[id],
  getOne: (id, short) => db[id][short]["long"],
  getDate: (id, short) => db[id][short]["date"],
  getVisits: (id, short) => db[id][short]["visits"],
  addVisit: (id, short) => { db[id][short].visits++},
  add: (id, short, lo, dt) => { db[id][short] = { long: lo, date: dt, visits: 0}},
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