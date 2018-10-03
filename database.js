// const db = [
//   { long: "http://www.lighthouselabs.ca", short: "b2xVn2" },
//   { long: "http://www.google.com", short: "s9m5xK"},
//   { long: "https://www.example.com", short: "ba985d"}
// ];

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

// module.exports= {
//   all: () => db,
//   byShort: (sh) => db.find(e => e.short == sh), // if we find an element whose short value is the same as sh, return it
//   byLong: (lo) => db.find(e => e.long == lo), // if we find an element whose long value is the same as lo, return it
//   add: (lo, sh) => db.push({ long: lo, short: sh}), //updates db?
//   update: (i, lo) => db[i]['long'] = lo,
//   index: (sh) => db.findIndex(e => e.short == sh), //returns id of a url
//   delete: (i) => db.splice( i, 1 ) //removes object with matching short
// };

module.exports = {
  all: () => db,
  userURL: (id) => db[id]
};