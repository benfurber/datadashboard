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

  // For each chart data
  function dataLoop(level1,level2,level3,theData,chartType) {

    for (var i = 0; i < level3.length; i++) {

        // Build each bar for the array
        var item = {};
        item.label = level3[i];
        if (chartType == 'line') { item.borderColor = backgroundColours[i]; }
        else { item.backgroundColor = backgroundColours[i]; }

        item.fill = false;

        // Add data and push to collections array
        item.data = results[level1].chartData[i];
        theData.push(item);
    };

  };

  function theChart(chartType,level1,level2,level3,location) {
    // Define the empty array for the chart data

    var theData = [];
    level2 = eval(level2);
    level3 = eval(level3);

    dataLoop(level1,level2,level3,theData,chartType);

    // Chart options
    if (chartType == 'horizontalBar') { var stackStatement = true }
    else { var stackStatement = false };

    var standardOptions = {
      legend: { display: true },
      title: { display: false },
      scales: { xAxes: [{ stacked: stackStatement }], yAxes: [{ stacked: stackStatement }] }
    };

    // Build the chart
    new Chart(document.getElementById(location), {
        type: chartType,
        data: {
          labels: level2,
          datasets: theData
        },
        options: standardOptions
    });

  };

  // Tables function

  function tables(level1,location) {

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
        var theNumber = results[level1][supporterTypesLabels[i]][channelTypesLabels[x]];
        tcells += ["<td>" + theNumber + "</td>"];
        runningTotals[supporterTypesLabels[i]] += theNumber;
        runningTotals[channelTypesLabels[x]] += theNumber;
      };

      tRowsCollections += ["<tr>" + tcells + "</tr>"];

    };

    $(location + " table").append("<thead><tr>" + tColumnTitles + "</tr></thead><tbody>" + tRowsCollections + "</tbody>");
    $(location).append('<div class="col-12 summary-title"></div>');
    $(location + " .summary-title").append("<p class='lead'><strong>Total: " + results[level1]['Total'] + "</strong></p>");

    $(location).append('<div class="col-6 first-col"></div>')
    for ( var i = 0; i < supporterTypesLabels.length; i++ ) { dataSummaries(runningTotals[supporterTypesLabels[i]],supporterTypesLabels[i],location + " .first-col"); }
    $(location).append('<div class="col-6 second-col"></div>')
    for ( var i = 0; i < channelTypesLabels.length; i++ ) { dataSummaries(runningTotals[channelTypesLabels[i]],channelTypesLabels[i],location + " .second-col"); }

  };

  // Calling the functions (The view?)

  theChart('horizontalBar','Collections','supporterTypesLabels','channelTypesLabels','chart1');
  tables('Collections','#table1');

  theChart('horizontalBar','Collectors','supporterTypesLabels','channelTypesLabels','chart2');
  tables('Collectors', '#table2');

  theChart('line','signUpDateType','allDatesLabels','supporterTypesLabels','chart3');


  pageTitles();


});
