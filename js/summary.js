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

    // Function for the labels for each column
    function columnLabels(columnName) {

      var object = [];
      for ( var i = 0; i < result.length; i++ ) {
        item = result[i][columnName]
        object.push(item);
      };

      object = [...new Set(object)];
      object.sort(); // Alphabetic order

      return object;
    }

    // Call the labels function
    var supporterTypes = columnLabels('supporterType');
    var channelTypes = columnLabels('theChannel');


    // CUSTOM SORTING OF COLUMNS HERE
    // Move 'Loyal' to be the last supporter label
    supporterTypes.splice(1,1);
    supporterTypes.push('Loyal');

    // Adding each label to the object
    function addLabels() {

      var labelsArray = {};

      function eachLabel(title,content) {
        labelsArray[title] = content;
      };

      eachLabel('supporterTypes',supporterTypes);
      eachLabel('channelTypes',channelTypes);

      return labelsArray;
    }


    // Function adding each section of the JSON
    function addObject(name,uniq=false) {

      // Adding these instant variables for reasons I don't quite understand.
      this.name = name;
      this.uniq = uniq;

      // Building the structure of the json
      var object = {};

      for ( var i = 0; i < supporterTypes.length; i++ ) {
        // Adding each type of supporter
        object[supporterTypes[i]] = {};
        for (var x = 0; x < channelTypes.length; x++ ) {
          // Adding each channel to each type of supporter
          object[supporterTypes[i]][channelTypes[x]] = 0;
        };
      };
      object['Total'] = 0;
      object['chartData'] = [];

      // Populating the object

      var uniqTracker = []; // Needed for unique if statement later down..

      for ( var i = 0; i < result.length; i++ ) {

        var item = result[i];

        // Runs if you need a unique total
        if (uniq) {
          if ( uniqTracker[item.regID] != item.regID ) {
            uniqTracker.push(item.regID);
            object['Total']++;
            object[item.supporterType][item.theChannel]++;
          };
        }

        // Run if you don't need a unique total
        else {
          object['Total']++;
          object[item.supporterType][item.theChannel]++;
        };

      }

      // Populating the ChartData object for Charts.js
      // While the rest of the JSON is channels within support type, the chart has to be the other way around.

      for ( var i = 0; i < channelTypes.length; i++) {
        var chartItem = [];
        for ( var x = 0; x < supporterTypes.length; x++ ) {
          chartItem.push(object[supporterTypes[x]][channelTypes[i]]);
        }
        object['chartData'].push(chartItem);
      }

      return object;

    };

    // Build the object that will be exported
    var forExport = {};

    // Populate the export object with the above function
    forExport['Collections'] = addObject('collections');
    forExport['Collectors'] = addObject('collectors',true);
    forExport['labels'] = addLabels();


    // Final command
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
