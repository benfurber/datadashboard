// V2 with mock data from Neolane exports and currently only the simple object from V1

const fs = require("fs");
const moment = require("moment");
const stream = require("stream");

const csv = require("csvtojson");

const mainData = "../data/neoexports/subscriptions.csv";
let mainArray = [];

// Secondary data sources that need blending with the main
let mappingObject = {};
let secondaryItemsList = {};

function addSecondaryItems(name,csvURL) {
  secondaryItemsList[name] = csvURL;
  mappingObject[name] = {};
};

addSecondaryItems('completionSource','../data/neoexports/lutsource.csv');
addSecondaryItems('shiftsSource','../data/neoexports/lutsource.csv');
addSecondaryItems('knownEmailAddresses','../data/neoexports/knownemailaddresses.csv');


// Add completion sources to the mapping object
var secondary1 = new Promise(function(resolve, reject) {
  csv()
    .fromFile(secondaryItemsList.completionSource)
    .on('json',(jsonObj)=>{
      mappingObject['completionSource'][jsonObj['Source Id']] = jsonObj['Source Desc']
    })
    .on('done',(error)=>{
      console.log('Completion sources CSV mapped.')
      resolve()
    })
});

// Add completion sources to the mapping object
var secondary2 = new Promise(function (resolve, reject) {
  mappingObject['knownEmailAddresses'] = {}
  csv()
    .fromFile(secondaryItemsList.knownEmailAddresses)
    .on('json',(jsonObj) => {
      if (jsonObj['Email Address'].match(/(@mc.org.uk)/)) {
        mappingObject['knownEmailAddresses'][jsonObj['Email Address']] = 'Staff'
      } else if (jsonObj['Status'] == ('Loyal' || 'Warm' || 'Staff' )) {
        mappingObject['knownEmailAddresses'][jsonObj['Email Address']] = jsonObj['Status']
      } else {
        mappingObject['knownEmailAddresses'][jsonObj['Email Address']] = 'Other'
      }
    })
    .on('done',(error)=>{
      console.log('Known email addresses CSV mapped.')
      resolve()
    })
});

Promise.all([secondary1,secondary2])
  .then(function(results) {
      csv() // {flatKeys:true}
      .fromFile(mainData)
        .on('json',(jsonObj, rowIndex)=>{

          // Creating an empty object. Will be pushed to the array at the end.
          let item = {}

          // Simple indexing to start.
          item['objectID'] = rowIndex

          // User ID moved over. Known as RecipientPrimarykey, Unique ID in other places.
          item['userID'] = jsonObj['RecipientPrimarykey']

          // Mapping the source URL
          let creationSource = jsonObj['Creation Source']
          item['creationSource'] = mappingObject['completionSource'][creationSource]

          // Adding a support type by checking against the knownEmailAddresses object
          console.log(mappingObject['knownEmailAddresses'].keys)
          if ( mappingObject.hasOwnProperty(item['Address']) ) {
            item['supporterType'] = mappingObject['knownEmailAddresses'][item['Address']]
          } else {
            console.log(item['Address'])
            item['supporterType'] = 'Cold'
          }

          mainArray.push(item)

        })
        .on('done',(error)=>{
            console.log('Finished building main JSON object')
            mainArray = JSON.stringify(mainArray, null, '\t');

            fs.writeFile("../data/processed/v2.json", mainArray, (err) => {

              // throws an error, you could also catch it here
              if(err) {
                  console.log("An error has occured while writing of the collections JSON file.");
                  console.log(err);
              };

              console.log(mappingObject)

              // success case, the file was saved
              console.log('Object written to JSON file.');

            });

        })
  })
  .catch(function(error) {
    console.log(error)
  })
