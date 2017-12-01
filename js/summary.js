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

    // The supporter types and channels
    var supporterTypes = ["cold", "warm", "loyal"];
    var channelTypes = ["email", "ppc", "search", "social", "offline"];

    // Building the JSON structures
    // Build the nested channels object first
    var channelsObject = {};
    for (var i = 0, len = channelTypes.length; i < len; i++) {
      channelsObject[channelTypes[i]] = 0;
    };

    // Can then built the parent object with the SAME child object
    var collectionsObjects = {};
    var collectorsObjects = {};

    // The children into the parents
    for (var i = 0, len = supporterTypes.length; i < len; i++) {
      collectionsObjects[supporterTypes[i]] = channelsObject;
      collectorsObjects[supporterTypes[i]] = channelsObject;
    };

    // And the parents into the grand-parents
    var forExport = {};
    forExport.collections = collectionsObjects;
    forExport.collectors = collectorsObjects;

    // Adding the supporter types and channels to the object
    forExport.supporterLabels = supporterTypes;
    forExport.channelLabels = channelTypes;

    // Adding an empty 'total' item to the object
    forExport.collections.total = 0;
    forExport.collectors.total = 0;

    // My innefficient way to make the child objects different otherwise the following loops with populate in multiple places
    forExport = JSON.stringify(forExport);
    forExport = JSON.parse(forExport);

    // The main bit - Populating of the JSON
    // Collections JSON populating
    for (var i = 0, len = result.length; i < len; i++) {
      var sType = result[i]["supporterType"].toLowerCase();
      var tChannel = result[i]["theChannel"].toLowerCase();
      forExport.collections[sType][tChannel] += 1;
      forExport.collections.total += 1;
    };

    // Collectors JSON populating
    var uniqueIDs = [];
    for (var i = 0, len = result.length; i < len; i++) {
      var tempID = result[i]["regID"];
      if (tempID != uniqueIDs[tempID]) {
        var sType = result[i]["supporterType"].toLowerCase();
        var tChannel = result[i]["theChannel"].toLowerCase();
        forExport.collectors[sType][tChannel] += 1;
        forExport.collectors.total += 1;
        uniqueIDs.push(tempID);
      }
    };

    // Collections data for charts.js
    var collectionsDataItems = [];
    for (var i = 0, len = channelTypes.length; i < len; i++) {
      var item1 = [];
      for (var x = 0, len2 = supporterTypes.length; x < len2; x++) {
        var cData = forExport.collectors[supporterTypes[x]][channelTypes[i]];
        item1.push(cData);
      }
      console.log(item1);
      collectionsDataItems.push(item1);
    };
    forExport.collections.chartData = collectionsDataItems;

    // Collectors data for charts.js
    var collectorsDataItems = [];
    for (var i = 0, len = channelTypes.length; i < len; i++) {
      var item2 = [];
      for (var x = 0, len2 = supporterTypes.length; x < len2; x++) {
        var cData = forExport.collectors[supporterTypes[x]][channelTypes[i]];
        item2.push(cData);
      }
      console.log(item2);
      collectorsDataItems.push(item2);
    };
    forExport.collectors.chartData = collectorsDataItems;

    // Convert to JSON (again)
    forExport = JSON.stringify(forExport, null, '\t');

    // Write the collections JSON to a file
    fs.writeFile("../data/processed/byChannel.json", forExport, (err) => {

      // throws an error, you could also catch it here
      if(err) {
          console.log("An error has occured while writing of the collections JSON file.");
          console.log(err);
      };

      // success case, the file was saved
      console.log("File written.");

    });
});
