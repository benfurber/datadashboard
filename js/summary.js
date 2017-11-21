'use strict';

const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');

const parser = parse({delimiter: ','})

const output = [];
const input = fs.createReadStream('../data/canvas1-processed.csv');

var transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);
