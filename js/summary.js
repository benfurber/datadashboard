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
    // create a variable called json and store
    // the result of the conversion
    var json = result;

    // The supporter types and channels
    var supporterTypes = ["Cold", "Warm", "Loyal"];
    var channelTypes = ["Email", "PPC", "Seach", "Social"];

    // Building the JSON structure

    var forExport = {
      "Cold": {
        "search": 0,
        "social": 0,
      },
      "Warm": {
        "search": 0,
        "social": 0,
      },
      "Loyal": {
        "search": 0,
        "social": 0,
      }
    };

    console.log(forExport["Cold"].search);

    for (var i = 0, len = json.length; i < len; i++) {
      json[i] = {
        regID : json[i].regID,
        supporterType: json[i].supporterType,
        theChannel: json[i].theChannel
      };
      if (json[i].supporterType == "Cold") {
        if (json[i].theChannel == "Search") {
          forExport["Cold"].search += 1
        };
      }
    }

    console.log(forExport);

    // log our json to verify it has worked
    console.log(json);
});
