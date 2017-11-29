var collectionsData = {};

var urlOptions = ['../data/processed/byChannel-Collections.json', '../data/processed/byChannel-Collectors.json'];
var urlOptionsSelect = 0;

// Chart colours
var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

var ajaxProcess = $.ajax({
  url: urlOptions[0],
  dataType: 'json',
},
{
  url: urlOptions[1],
  dataType: 'json',
}
).done(function (results1, results2) {

  console.log(results2);

  // Simplifying some items that have to be referred to further down.
  var cLabels = results1.channelLabels;
  var sLabels = results1.supporterLabels;

  var collectionsData = results1.chartData;
  var collectorsData = results2.chartData;

  // Define the empty array for the chart data
  var dataset1 = [];
  var dataset2 = [];

  // Build the content of the collections data array
  for (var i = 0, len = cLabels.length; i < len; i++) {

      // Build each bar for the array
      var item = {};
      item.label = cLabels[i].toUpperCase();
      item.backgroundColor = backgroundColours[i];
      item.data = collectionsData[i];

      // Push the bar the array
      dataset1.push(item);
  };

  var standardOptions = {
    legend: { display: true },
    title: { display: false },
    scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
  }

  // Build the collections chart
  new Chart(document.getElementById("chart1"), {
      type: 'horizontalBar',
      data: {
        labels: sLabels.map(x => x.toUpperCase()),
        datasets: dataset1
      },
      options: standardOptions
  });

  // Build the collectors chart
  new Chart(document.getElementById("chart2"), {
      type: 'horizontalBar',
      data: {
        labels: sLabels.map(x => x.toUpperCase()),
        datasets: dataset2
      },
      options: standardOptions
  });

});
