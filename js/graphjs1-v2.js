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

  var chart1Data = {
    labels: sLabels,
    datasets: [
      {
        label: "Channel1",
        backgroundColor: "#3e95cd",
        data: [3,4,1]
      },
      {
        label: "Channel2",
        backgroundColor: "#8e5ea2",
        data: [5,0,7]
      },
      {
        label: "Channel3",
        backgroundColor: "#3cba9f",
        data: [2,3,2]
      }
    ]
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
