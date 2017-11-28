var collectionsData = {};
var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel-Collections.json',
  dataType: 'json',
}).done(function (results) {
  collectionsData = results;

  // Simplifying some items that have to be referred to further down.
  var cLabels = collectionsData.channelLabels;
  var sLabels = collectionsData.supporterLabels;
  var chartData = collectionsData.chartData;

  // Chart colours
  var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

  // Define the empty array for the chart data
  var theData = [];

  // Build the content of the data array
  for (var i = 0, len = cLabels.length; i < len; i++) {

      // Build each bar for the array
      var item = {};
      item.label = cLabels[i].toUpperCase();
      item.backgroundColor = backgroundColours[i];
      item.data = chartData[i];

      // Push the bar the array
      theData.push(item);
  };

  var chart1Data = {
    labels: sLabels.map(x => x.toUpperCase()),
    datasets: theData
  };

  new Chart(document.getElementById("chart1"), {
      type: 'horizontalBar',
      data: chart1Data,
      options: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Cold/Warm/Loyal'
        },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        }
      }
  });

});
