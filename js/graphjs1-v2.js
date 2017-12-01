// Chart colours
var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}
).done(function (results) {

  // Simplifying some items that have to be referred to further down.
  var cLabels = results.channelLabels;
  var sLabels = results.supporterLabels;

  // Define the empty arrays for the chart data
  var collectionsData = [];
  var collectorsData = [];

  // Build the contents of the data arrays
  for (var i = 0, len = cLabels.length; i < len; i++) {

      // Build each bar for both arrays
      var item1 = {};
      var item2 = {};
      item1.label = cLabels[i].toUpperCase();
      item2.label = cLabels[i].toUpperCase();
      item1.backgroundColor = backgroundColours[i];
      item2.backgroundColor = backgroundColours[i];

      // Add data and push to collections array
      item1.data = results.collections.chartData[i];
      collectionsData.push(item1);

      // Add data and push to collectors array
      item2.data = results.collectors.chartData[i];
      collectorsData.push(item2);
      console.log(item2);
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
        datasets: collectionsData
      },
      options: standardOptions
  });

  // Build the collectors chart
  new Chart(document.getElementById("chart2"), {
      type: 'horizontalBar',
      data: {
        labels: sLabels.map(x => x.toUpperCase()),
        datasets: collectorsData
      },
      options: standardOptions
  });

});
