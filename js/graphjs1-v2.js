var collectionsData = {};
var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel-Collections.json',
  dataType: 'json',
}).done(function (results) {
  collectionsData = results;

  var cLabels = collectionsData.channelLabels;
  var sLabels = collectionsData.supporterLabels;

  var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

  var theData = [];
  for (var i = 0, len = 5; i < len; i++) {
      var item = {};
      item.label = cLabels[i].toUpperCase();
      item.backgroundColor = backgroundColours[i];
      item.data = [];
      for (var x = 0, len2 = sLabels.length; x < len2; x++) {
        var cData = collectionsData[sLabels[x]][cLabels[i]];
        item.data.push(cData);
      }
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
