var fs = require("fs");
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

var theData = {};

converter.fromFile("../data/processed/byChannel-Collections.json",function(err,result) {
  theData = result;
});

console.log(JSON.stringify(theData));

var chart1Data = {
  labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
  datasets: [
    {
      label: "Population (millions)",
      backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
      data: [2478,5267,734,784,433]
    }
  ]
};

new Chart(document.getElementById("chart1"), {
    type: 'horizontalBar',
    data: chart1Data,
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
});
