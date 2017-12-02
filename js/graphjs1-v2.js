var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}
).done(function (results) {

  // Simplifying some items that have to be referred to further down.
  var cLabels = results.channelLabels;
  var sLabels = results.supporterLabels;

  // Chart colours
  var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

  function theChart(dataType,location) {
    // Define the empty array for the chart data
    var theData = [];

    // Build the contents of the data array
    for (var i = 0, len = cLabels.length; i < len; i++) {

        // Build each bar for the array
        var item = {};
        item.label = cLabels[i].toUpperCase();
        item.backgroundColor = backgroundColours[i];

        // Add data and push to collections array
        item.data = results[dataType].chartData[i];
        theData.push(item);
    };

    console.log(theData);

    // Chart options
    var standardOptions = {
      legend: { display: true },
      title: { display: false },
      scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
    };

    // Build the chart
    new Chart(document.getElementById(location), {
        type: 'horizontalBar',
        data: {
          labels: sLabels.map(x => x.toUpperCase()),
          datasets: theData
        },
        options: standardOptions
    });

  };

  theChart('collections','chart1');
  theChart('collectors','chart2');

  // Edit the page headings with the totalShifts
  $("#totalShifts").append(results.collections.total);
  $("#totalCollectors").append(results.collectors.total);

});
