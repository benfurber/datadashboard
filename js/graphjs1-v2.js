var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}).done(function (results) {


  var startDate = new Date(2018,0,01) // For some silly reason months are zero based (i.e. Jan = 0).
  var endDate = new Date(2018,0,31)


  // Regularly required labels/variables.
  var cLabels = results.labels.channelTypes;
  var sLabels = results.labels.supporterTypes;
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
    for (var i = 0, len = cLabels.length; i < len; i++) {

        // Build each bar for the array
        var item = {};
        item.label = cLabels[i];
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
          labels: sLabels,
          datasets: theData
        },
        options: standardOptions
    });

  };

  function lineChart(location) {
    // Define the empty array for the chart data
    var theData = [{
      data: [5,7,4,2,50],
      label: 'All',
      borderColor: "#444444",
      fill: false
    },
    {
      data: [2,2,3,0,2],
      label: 'Email',
      borderColor: "#3e95cd",
      fill: false
    }];

    var dates = ["01/01/2018","02/01/2018","03/01/2018","04/01/2018","05/01/2018"]

    // Chart options
    var standardOptions = {
      title: { display: false }
    };

    // Build the chart
    new Chart(document.getElementById(location), {
        type: 'line',
        data: {
          labels: dates,
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

    for ( var i = 0; i < cLabels.length; i++ ) {
      tColumnTitles += "<th>" + cLabels[i] + "</th> "
    };

    // A running totals object for later on
    var runningTotals = {};
    for ( var i = 0; i < sLabels.length; i++ ) { runningTotals[sLabels[i]] = 0; }
    for ( var i = 0; i < cLabels.length; i++ ) { runningTotals[cLabels[i]] = 0; }

    // Build each row and add a total for each cell as we go to the running total
    var tRowsCollections = [];

    for ( var i = 0; i < sLabels.length; i++ ) {

      var tcells = [];

      // The row title
      tcells += ["<th scope='row'>" + sLabels[i] + "</th>"];

      // Each content cell
      for ( var x = 0; x < cLabels.length; x++ ) {
        var theNumber = results[type][sLabels[i]][cLabels[x]];
        tcells += ["<td>" + theNumber + "</td>"];
        runningTotals[sLabels[i]] += theNumber;
        runningTotals[cLabels[x]] += theNumber;
      };

      tRowsCollections += ["<tr>" + tcells + "</tr>"];

    };

    $(location + " table").append("<thead><tr>" + tColumnTitles + "</tr></thead><tbody>" + tRowsCollections + "</tbody>");
    $(location).append('<div class="col-12 summary-title"></div>');
    $(location + " .summary-title").append("<p class='lead'><strong>Total: " + results[type]['Total'] + "</strong></p>");

    $(location).append('<div class="col-6 first-col"></div>')
    for ( var i = 0; i < sLabels.length; i++ ) { dataSummaries(runningTotals[sLabels[i]],sLabels[i],location + " .first-col"); }
    $(location).append('<div class="col-6 second-col"></div>')
    for ( var i = 0; i < cLabels.length; i++ ) { dataSummaries(runningTotals[cLabels[i]],cLabels[i],location + " .second-col"); }

  };

  // Calling the functions (The view?)

  theChart('Collections','chart1');
  tables('Collections', '#table1');

  theChart('Collectors','chart2');
  tables('Collectors', '#table2');

  pageTitles();

  lineChart('chart3');

});
