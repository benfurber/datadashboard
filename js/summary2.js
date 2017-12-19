// V2 with mock data from Neolane exports and currently only the simple object from V1

var fs = require("fs");
var moment = require("moment");

//require the csvtojson converter class
var Converter = require("csvtojson").Converter;

// create a new converter object
var converter = new Converter({});

// Building the object that will be exported
var forExport = {};

// call the fromFile function which takes in the path to your
// csv file as well as a callback function
function fileLoad(url) {
  converter.fromFile(url,function(err,result){

    // if an error has occured then handle it
    if(err){
        console.log("An error has occured in the processing of the CSV.");
        console.log(err);
    }

    // console.log(result);

    // Function to simply take the CSV and reformat as a JSON for pivottable.js - objects within an array
    function simpleObject() {

      var object = [];

      for (var i = 0; i < result.length; i++) {

        var item = {};

        item.id = result[i].regID;
        item["Supporter Type"] = result[i].supporterType;
        item["Channel Type"] = result[i].theChannel;
        item["Sign-up Date"] = result[i].signupDate;

        object.push(item);
      };

      return object;

    }

    // Call the function - adding the object to the export object
    forExport = simpleObject();

    // Final commands
    forExport = JSON.stringify(forExport, null, '\t');

    return forExport

  });
};

// Write the pivot table JSON to a file
function buildFile(url,variable) {
  fs.writeFile(url, variable, (err) => {

    // throws an error, you could also catch it here

    if(variable == undefined || variable.length < 2) {
          return console.log("Empty object - file NOT written.");
    };

    if(err) {
        console.log("An error has occured while writing of the pivot table JSON file.");
        console.log(err);
    };

    // success case, the file was saved
    console.log("Pivot table JSON file written.");

  });
};

forExport = fileLoad("../data/canvas1-processed.csv");
buildFile("../data/processed/pivottable-2.json",forExport);
