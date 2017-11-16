var fs = require("fs");
var d3 = require("d3");
var _ = require("lodash");

var theData = fs.readFile("../data/canvas1.csv", "utf8", function(error, data) {
  return d3.csvParse(data);
});

console.log(theData);
