var fs = require("fs");

//require the csvtojson converter class
var Converter = require("csvtojson").Converter;

// create a new converter object
var converter = new Converter({});

// call the fromFile function which takes in the path to your
// csv file as well as a callback function
converter.fromFile("../data/canvas1-processed.csv",function(err,result){

    // if an error has occured then handle it
    if(err){
        console.log("An error has occured in the processing of the CSV.");
        console.log(err);
    }

    // DEBUG OPTION - log the CSV to verify it has worked
    // console.log(result)

    // The supporter types and channels
    var supporterTypes = ["cold", "warm", "loyal"];
    var channelTypes = ["email", "ppc", "search", "social", "offline"];

    // Building the JSON structures
    // Have to build the nested channels object first
    var channelsObject = {};
    for (var i = 0, len = channelTypes.length; i < len; i++) {
      channelsObject[channelTypes[i]] = 0;
    };

    // Can then built the parent object with the SAME child object
    var forExport = {};
    for (var i = 0, len = supporterTypes.length; i < len; i++) {
      forExport[supporterTypes[i]] = channelsObject;
    };
    // Now building the chartsjs summary arrays item (again nested so a child/parent set of loops needed)
    forExport.chartsSummary = {};
    for (var i = 0, len = channelTypes.length; i < len; i++) {

    };

    // Needs to look like: chartsSummary: {[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]}

    // My innefficient way to make the child objects different
    forExport = JSON.stringify(forExport);
    forExport = JSON.parse(forExport);

    // Copy of the above object for collectors
    var forExportCollectors = forExport;
    forExportCollectors = JSON.stringify(forExportCollectors);
    forExportCollectors = JSON.parse(forExportCollectors);

    // The main bit - Populating of the JSON
    // Collections JSON populating
    for (var i = 0, len = result.length; i < len; i++) {
      var sType = result[i]["supporterType"].toLowerCase();
      var tChannel = result[i]["theChannel"].toLowerCase();
      forExport[sType][tChannel] += 1;
    };


    // Collectors JSON populating
    var uniqueIDs = [];
    for (var i = 0, len = result.length; i < len; i++) {
      var tempID = result[i]["regID"];
      if (tempID != uniqueIDs[tempID]) {
        var sType = result[i]["supporterType"].toLowerCase();
        var tChannel = result[i]["theChannel"].toLowerCase();
        forExportCollectors[sType][tChannel] += 1;
        uniqueIDs.push(tempID);
      }
    };

    // Adding the labels as objects to both JSON files
    forExport.supporterLabels = supporterTypes;
    forExport.channelLabels = channelTypes;
    forExportCollectors.supporterLabels = supporterTypes;
    forExportCollectors.channelLabels = channelTypes;

    // DEBUG OPTION - log the object to verify it has worked
    // console.log(forExportCollectors);

    // Convert EACH ONE to JSON
    forExport = JSON.stringify(forExport, null, '\t');
    forExportCollectors = JSON.stringify(forExportCollectors, null, '\t');

    // Write the collections JSON to a file
    fs.writeFile("../data/processed/byChannel-Collections.json", forExport, (err) => {

      // throws an error, you could also catch it here
      if(err) {
          console.log("An error has occured while writing of the collections JSON file.");
          console.log(err);
      };

      // success case, the file was saved
      console.log("Collctions file written.");

    });

    // Write the collectors JSON to a file
    fs.writeFile("../data/processed/byChannel-Collectors.json", forExportCollectors, (err) => {
      if(err) {
          console.log("An error has occured while writing the collectors JSON file.");
          console.log(err);
      };
      console.log("Collectors file written.");
    });

});