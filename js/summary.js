//require the csvtojson converter class
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});

// call the fromFile function which takes in the path to your
// csv file as well as a callback function
converter.fromFile("../data/canvas1-processed.csv",function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An error Has occured");
        console.log(err);
    }

    console.log(result)

    // The supporter types and channels
    var supporterTypes = ["cold", "warm", "loyal"];
    var channelTypes = ["email", "ppc", "search", "social"];

    // Building the JSON structure
    var channelsObject = {};
    for (var i = 0, len = channelTypes.length; i < len; i++) {
      channelsObject[channelTypes[i]] = 0;
    };

    var forExport = {};
    for (var i = 0, len = supporterTypes.length; i < len; i++) {
      forExport[supporterTypes[i]] = channelsObject;
    };

    for (var i = 0, len = result.length; i < len; i++) {
      if (result[i]["supporterType"] == "Cold" && result[i]["theChannel"] == "Email") {
        forExport["cold"]["email"] += 1;
      }
    };

    // log our json to verify it has worked
    console.log(forExport);

});
