// V2 with mock data from Neolane exports and currently only the simple object from V1

const fs = require("fs");
const moment = require("moment");
const stream = require('stream');

const csv = require("csvtojson");

const mainData = '../data/canvas1-processed.csv';
let mainObject = {};

// Secondary data sources that need blending with the main
let mappingObject = {};
let secondaryItemsList = {};

function addSecondaryItems(name,csvURL) {
  secondaryItemsList[name] = csvURL;
  mappingObject[name] = {};
};

addSecondaryItems('completionSource','../data/neoexports/lutsource.csv');
addSecondaryItems('shiftsSource','../data/neoexports/lutsource.csv');


// Add completion sources to the mapping object
csv()
.fromFile(secondaryItemsList.completionSource)
.on('json',(jsonObj, rowIndex)=>{
    mappingObject['completionSource'][jsonObj['Source Desc']] = jsonObj['Source Id']
  })
  .on('done',(error)=>{
      console.log('end')
      console.log(mappingObject)
  })

// Add completion sources to the mapping object
csv()
.fromFile(secondaryItemsList.shiftsSource)
.on('json',(jsonObj, rowIndex)=>{
    mappingObject['shiftsSource'][jsonObj['Source Id']] = jsonObj['Source Desc']
  })
  .on('done',(error)=>{
      console.log('end')
      console.log(mappingObject)
  })
