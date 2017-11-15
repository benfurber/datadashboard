var fs = require("fs");
var d3 = require("d3");
var _ = require("lodash");

var theData = fs.readFile("../data/canvas1.csv", "utf8", function(error, data) {
  data = d3.csvParse(data);
});

var coldCollectors = theData.filter(function(d) { return d.supporterType == "Cold"; });

coldCollectorsString = JSON.stringify(coldCollectors);

fs.writeFile("collectors.json", coldCollectorsString, function(err){
  console.log("File written");
});
