'use strict';

const parse     = require('csv-parse');
const stringify = require('csv-stringify');
const transform = require('stream-transform');
const fs        = require('fs-extra-promise');

const infname   = '../data/canvas1.csv';
const outfname  = '../data/canvas1-processed.csv';

const inputFields = ['regID','channel','supporterType'];
const extractFields = ['regID','supporterType','channel'];
const outputFields = ['regID','supporterType','theChannel']

fs.createReadStream(infname)
.pipe(parse({
    delimiter: ',',
    // Use columns: true if the input has column headers
    // Otherwise list the input field names in the array above.
    columns: true
}))
.pipe(transform(function(data) {
    // This sample transformation selects out fields
    // that will make it through to the output.  Simply
    // list the field names in the array above.
    return extractFields
    .map(nm => { return data[nm]; });
}))
.pipe(stringify({
    delimiter: ',',
    relax_column_count: true,
    skip_empty_lines: true,
    header: true,
    // This names the resulting columns for the output file.
    columns: outputFields
}))
.pipe(fs.createWriteStream(outfname));
