// V2 with mock data from Neolane exports and currently only the simple object from V1

const fs = require("fs");
const moment = require("moment");
const stream = require('stream');

const csv = require("csvtojson");

const mainData = '../data/neoexports/subscriptions.csv';
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
function secondary1() {
  csv()
    .fromFile(secondaryItemsList.completionSource)
    .on('json',(jsonObj)=>{
      mappingObject['completionSource'][jsonObj['Source Id']] = jsonObj['Source Desc']
    })
    .on('done',(error)=>{
      console.log('Completion sources CSV mapped.')
    })
}
// Add completion sources to the mapping object
function secondary2() {
  mappingObject['knownEmailAddresses'] = {}
  csv()
    .fromFile(secondaryItemsList.knownEmailAddresses)
    .on('json',(jsonObj) => {
      if (jsonObj['Email Address'].match(/(@mc.org.uk)/)) {
        mappingObject['knownEmailAddresses']['emailAddress'] = jsonObj['Email Address'],
        mappingObject['knownEmailAddresses']['userType'] = 'Staff'
      } else if (jsonObj['Status'] == ('Loyal' || 'Warm' || 'Staff' )) {
        mappingObject['knownEmailAddresses']['emailAddress'] = jsonObj['Email Address'],
        mappingObject['knownEmailAddresses']['userType'] = jsonObj['Status']
      } else {
        mappingObject['knownEmailAddresses']['emailAddress'] = jsonObj['Email Address'],
        mappingObject['knownEmailAddresses']['userType'] = 'Other'
      }
    })
    .on('done',(error)=>{
      console.log('Known email addresses CSV mapped.')
      console.log(mappingObject['knownEmailAddresses'])
    })
}

Promise.all([secondary1(),secondary2()])
  .then(function() {
      csv() // {flatKeys:true}
      .fromFile(mainData)
        .on('json',(jsonObj, rowIndex)=>{

          // Creating an empty object. Will be pushed to the array at the end.
          let item = {}

          // Simple indexing to start.
          item['objectID'] = rowIndex

          // User ID moved over. Known as RecipientPrimarykey, Unique ID in other places.
          item['userID'] = jsonObj['RecipientPrimarykey']

          // Mapping the
          let creationSource = jsonObj['Creation Source']
          item['creationSource'] = mappingObject['completionSource'][creationSource]

          mainArray.push(item)

        })
        .on('done',(error)=>{
            console.log('Finished building main JSON object')
            console.log(mainArray)
            mainArray = JSON.stringify(mainArray, null, '\t');

            fs.writeFile("../data/processed/v2.json", mainArray, (err) => {

              // throws an error, you could also catch it here
              if(err) {
                  console.log("An error has occured while writing of the collections JSON file.");
                  console.log(err);
              };

              // success case, the file was saved
              console.log('Object written to JSON file.');

            });

        })
  })
