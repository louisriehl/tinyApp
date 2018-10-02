const db = [
  { long: "http://www.lighthouselabs.ca", short: "b2xVn2" },
  { long: "http://www.google.com", short: "9sm5xK"},
  { long: "https://www.example.com", short: "ba985d"}
];

module.exports= {
  all: () => db,
  byShort: (sh) => db.find(e => e.short == sh), // if we find an element whose short value is the same as sh, return it
  byLong: (lo) => db.find(e => e.long == lo), // if we find an element whose long value is the same as lo, return it
  update: (lo, sh) => db.push({ long: lo, short: sh}) //updates db?
};