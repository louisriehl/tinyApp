const db = [
  { long: "http://www.lighthouselabs.ca", short: "b2xVn2" },
  { long: "http://www.google.com", short: "9sm5xK"},
  { long: "https://www.example.com", short: "ba985d"}
];

module.exports= {
  all: () => db,
  byShort: (short) => db.find(e => e.short == e),
  byLong: (long) => db.find(e => e.long == e)
};