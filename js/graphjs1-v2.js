var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}).done(function (results) {

  // Regularly required labels/variables.
  var channelTypesLabels = results.labels.channelTypes;
  var supporterTypesLabels = results.labels.supporterTypes;
  var allDatesLabels = results.labels.allDates;
  var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];


  // Functions! (The model?)

  // Titles
  // Page titles
  function pageTitles() {

    // Edit the page headings with the totalShifts
    $("#totalShifts").append(results.Collections.Total);
    $("#totalCollectors").append(results.Collectors.Total);

  };

  // More specific Titles
  // Calling this function a lot in the tables function below

  function dataSummaries(data,title,location) {
    $(location).append("<span>" + title + ": " + data + "</span><br/>");
  };

  // Charts functions

  function theChart(dataType,location) {
    // Define the empty array for the chart data
    var theData = [];

    // Build the contents of the data array
    for (var i = 0, len = channelTypesLabels.length; i < len; i++) {

        // Build each bar for the array
        var item = {};
        item.label = channelTypesLabels[i];
        item.backgroundColor = backgroundColours[i];

        // Add data and push to collections array
        item.data = results[dataType].chartData[i];
        theData.push(item);
    };

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
          labels: supporterTypesLabels,
          datasets: theData
        },
        options: standardOptions
    });

  };

  function dataLoop() {

    for (var i = 0; i < signUpDateTypeLabels.length; i++) {

        // Build each bar for the array
        var item = {};
        item.label = channelTypesLabels[i];
        item.backgroundColor = backgroundColours[i];

        // Add data and push to collections array
        item.data = results[dataType].chartData[i];
        theData.push(item);
    };

  };

  function lineChart(dataType,location) {
    // Define the empty array for the chart data

    var theData = [];

    // function dataLoop();

    var theData = [{
      data: results.signUpDateType.chartData[0],
      label: 'Cold',
      borderColor: "#444444",
      fill: false
    },
    {
      data: results.signUpDateType.chartData[1],
      label: 'Warm',
      borderColor: "#3e95cd",
      fill: false
    }];

    // Chart options
    var standardOptions = {
      legend: { display: true },
      title: { display: false },
      scales: { xAxes: [{ stacked: false }], yAxes: [{ stacked: false }] }
    };

    // Build the chart
    new Chart(document.getElementById(location), {
        type: 'line',
        data: {
          labels: allDatesLabels,
          datasets: theData
        },
        options: standardOptions
    });

  };

  // Tables function

  function tables(type,location) {

    // Build the title row
    var tColumnTitles = "";

    tColumnTitles += "<th></th>" // Empty cell at the beginning

    for ( var i = 0; i < channelTypesLabels.length; i++ ) {
      tColumnTitles += "<th>" + channelTypesLabels[i] + "</th> "
    };

    // A running totals object for later on
    var runningTotals = {};
    for ( var i = 0; i < supporterTypesLabels.length; i++ ) { runningTotals[supporterTypesLabels[i]] = 0; }
    for ( var i = 0; i < channelTypesLabels.length; i++ ) { runningTotals[channelTypesLabels[i]] = 0; }

    // Build each row and add a total for each cell as we go to the running total
    var tRowsCollections = [];

    for ( var i = 0; i < supporterTypesLabels.length; i++ ) {

      var tcells = [];

      // The row title
      tcells += ["<th scope='row'>" + supporterTypesLabels[i] + "</th>"];

      // Each content cell
      for ( var x = 0; x < channelTypesLabels.length; x++ ) {
        var theNumber = results[type][supporterTypesLabels[i]][channelTypesLabels[x]];
        tcells += ["<td>" + theNumber + "</td>"];
        runningTotals[supporterTypesLabels[i]] += theNumber;
        runningTotals[channelTypesLabels[x]] += theNumber;
      };

      tRowsCollections += ["<tr>" + tcells + "</tr>"];

    };

    $(location + " table").append("<thead><tr>" + tColumnTitles + "</tr></thead><tbody>" + tRowsCollections + "</tbody>");
    $(location).append('<div class="col-12 summary-title"></div>');
    $(location + " .summary-title").append("<p class='lead'><strong>Total: " + results[type]['Total'] + "</strong></p>");

    $(location).append('<div class="col-6 first-col"></div>')
    for ( var i = 0; i < supporterTypesLabels.length; i++ ) { dataSummaries(runningTotals[supporterTypesLabels[i]],supporterTypesLabels[i],location + " .first-col"); }
    $(location).append('<div class="col-6 second-col"></div>')
    for ( var i = 0; i < channelTypesLabels.length; i++ ) { dataSummaries(runningTotals[channelTypesLabels[i]],channelTypesLabels[i],location + " .second-col"); }

  };

  // Calling the functions (The view?)

  theChart('Collections','chart1');
  tables('Collections', '#table1');

  theChart('Collectors','chart2');
  tables('Collectors', '#table2');

  lineChart('signUpDateType','chart3');

  pageTitles();

  lineChart('chart3');

});
