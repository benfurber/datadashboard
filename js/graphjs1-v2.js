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

    if (chartType == 'doughnut') { var length = level2.length }
    else { var length = level3.length }

    if (chartType == 'doughnut') {
      var item = {
        backgroundColor: [],
        data: []
      };
      for (var i = 0; i < length; i++) {
        var subTotal = 0;
        for (var x = 0; x < level3.length; x++) {
          subTotal += results[level1][level2[i]][level3[x]];
        }
        item['backgroundColor'].push(backgroundColours[i]);
        item['data'].push(subTotal);
      }
      theData.push(item);
    }
    else {
      for (var i = 0; i < length; i++) {

          // Build each item for the array
          var item = {
            backgroundColor: [],
            data: []
          };
          item.label = level3[i];

          if (chartType == 'line') { item.borderColor = backgroundColours[i]; }
          else { item.backgroundColor = backgroundColours[i]; }

          item.fill = false;

          // Add data and push to collections array
          item.data = results[level1].chartData[i];
          theData.push(item);
      };
    };
  };

  function theChart(chartType,level1,level2,level3,location) {
    // Define the empty array for the chart data

    var theData = [];
    level2 = eval(level2);
    level3 = eval(level3);

    dataLoop(level1,level2,level3,theData,chartType);

    // Chart options
    if (chartType == 'horizontalBar') {
      var standardOptions = {
        title: { display: false },
        scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
      };
    } else { var standardOptions = { title: { display: false } }; }

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

  function tables(level1,level2,level3,location,displayTable=true,displayTotals=true) {

    level2 = eval(level2);
    level3 = eval(level3);

    // Build the title row
    var tColumnTitles = "";

    tColumnTitles += "<th></th>" // Empty cell at the beginning

    for ( var i = 0; i < level3.length; i++ ) {
      tColumnTitles += "<th>" + level3[i] + "</th> "
    };

    // A running totals object for later on
    var runningTotals = {};
    for ( var i = 0; i < level2.length; i++ ) { runningTotals[level2[i]] = 0; }
    for ( var i = 0; i < level3.length; i++ ) { runningTotals[level3[i]] = 0; }

    // Build each row and add a total for each cell as we go to the running total
    var tRowsCollections = [];

    for ( var i = 0; i < level2.length; i++ ) {

      var tcells = [];

      // The row title
      tcells += ["<th scope='row'>" + level2[i] + "</th>"];

      // Each content cell
      for ( var x = 0; x < level3.length; x++ ) {
        var theNumber = results[level1][level2[i]][level3[x]];
        tcells += ["<td>" + theNumber + "</td>"];
        runningTotals[level2[i]] += theNumber;
        runningTotals[level3[x]] += theNumber;
      };

      tRowsCollections += ["<tr>" + tcells + "</tr>"];

    };

    if (displayTable == true) {
      $(location + " table").append("<thead><tr>" + tColumnTitles + "</tr></thead><tbody>" + tRowsCollections + "</tbody>");
      $(location).append('<div class="col-12 summary-title"></div>');
      $(location + " .summary-title").append("<p class='lead'><strong>Total: " + results[level1]['Total'] + "</strong></p>");
    };

    if (displayTotals == true) {
      $(location).append('<div class="col-6 first-col"></div>')
      for ( var i = 0; i < level2.length; i++ ) { dataSummaries(runningTotals[level2[i]],level2[i],location + " .first-col"); }
      $(location).append('<div class="col-6 second-col"></div>')
      for ( var i = 0; i < level3.length; i++ ) { dataSummaries(runningTotals[level3[i]],level3[i],location + " .second-col"); }
    };

  };

  // Calling the functions (The view?)

  theChart('horizontalBar','Collections','supporterTypesLabels','channelTypesLabels','chart11');
  tables('Collections','supporterTypesLabels','channelTypesLabels','#table11');

  theChart('horizontalBar','Collectors','supporterTypesLabels','channelTypesLabels','chart12');
  tables('Collectors','supporterTypesLabels','channelTypesLabels','#table12');

  theChart('doughnut','Collectors','supporterTypesLabels','channelTypesLabels','chart13');
  theChart('doughnut','Collectors','supporterTypesLabels','channelTypesLabels','chart13');

  theChart('line','signUpDateType','allDatesLabels','supporterTypesLabels','chart21');
  tables('signUpDateType','allDatesLabels','supporterTypesLabels','#table21',false);

  theChart('line','signUpDateChannel','allDatesLabels','channelTypesLabels','chart22');
  tables('signUpDateChannel','allDatesLabels','channelTypesLabels','#table22',false);


  pageTitles();


});
