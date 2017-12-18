var fs = require("fs");
var moment = require("moment");

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

    // Date label - done differently to ensure it's sequential
    // Thanks to @miguelmota for the script - https://gist.github.com/miguelmota/7905510
    // I should edit the script to make better use of Moment.js, currently only used right at the end for formatting
    var getDates = function(startDate, endDate) {
      var dates = [],
          currentDate = startDate,
          addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
          };
      while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    };

    // Usage
    var dates = getDates(new Date(2018,00,01), new Date(2018,00,31));
    var allDates = []
    dates.forEach(function(date) {
      allDates.push(moment(date).format("DD/MM/YYYY"));
    });

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
      eachLabel('allDates',allDates);

      return labelsArray;
    }

    // Function adding each section of the JSON
    function addObject(name,level1,level2,uniq=false) {

      // Adding these instant variables for reasons I don't quite understand.
      this.name = name; this.uniq = uniq;

      var l1 = eval(level1);
      var l2 = eval(level2);

      // Building the structure of the json
      var object = {};

      for ( var i = 0; i < l1.length; i++ ) {
        // Adding each type of supporter
        object[l1[i]] = {};
        for (var x = 0; x < l2.length; x++ ) {
          // Adding each channel to each type of supporter
          object[l1[i]][l2[x]] = 0;
        };
      };

      object['Total'] = 0;
      object['chartData'] = [];

      // Populating the object

      var uniqTracker = []; // Needed for unique if statement later down..

      for ( var i = 0; i < result.length; i++ ) {

        var item = result[i];

        // Having to add level1/col1 and level2/col2 is annoying so I need map labels to column names
        var map = {
          supporterTypes: item.supporterType,
          channelTypes: item.theChannel,
          allDates: item.signupDate,
        }

        var c1 = map[level1];
        var c2 = map[level2];

        function add() {
          object['Total']++;
          object[c1][c2]++ ;
        }
        // Runs if you need a unique total
        if (uniq) {
          if ( uniqTracker[item.regID] != item.regID ) {
            uniqTracker.push(item.regID);
            add()
          };
        } else { add() };

      }

      // Populating the ChartData object for Charts.js
      // While the rest of the JSON is channels within support type, the chart has to be the other way around.

      for ( var i = 0; i < l2.length; i++) {
        var chartItem = [];
        for ( var x = 0; x < l1.length; x++ ) {
          chartItem.push(object[l1[x]][l2[i]]);
        }
        object['chartData'].push(chartItem);
      }

      return object;

    };

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
      }

      return object;

    }

    // Build the object that will be exported
    var forExport = {};

    // Populate the export object with the above function
    forExport['Collections'] = addObject('collections','supporterTypes','channelTypes');
    forExport['Collectors'] = addObject('collectors','supporterTypes','channelTypes',true);
    forExport['signUpDateType'] = addObject('signUpDateType','allDates','supporterTypes',true);
    forExport['signUpDateChannel'] = addObject('signUpDateChannel','allDates','channelTypes',true);
    forExport['labels'] = addLabels();

    var secondExport = {};
    secondExport = simpleObject();


    // Final commands
    forExport = JSON.stringify(forExport, null, '\t');
    secondExport = JSON.stringify(secondExport, null, '\t');

    // Write the collections JSON to a file
    fs.writeFile("../data/processed/byChannel.json", forExport, (err) => {

      // throws an error, you could also catch it here
      if(err) {
          console.log("An error has occured while writing of the collections JSON file.");
          console.log(err);
      };

      // success case, the file was saved
      console.log("By channel summary JSON file written.");

    });

    // Write the pivot table JSON to a file
    fs.writeFile("../data/processed/pivottable.json", secondExport, (err) => {

      // throws an error, you could also catch it here
      if(err) {
          console.log("An error has occured while writing of the pivot table JSON file.");
          console.log(err);
      };

      // success case, the file was saved
      console.log("Pivot table JSON file written.");

    });

});
