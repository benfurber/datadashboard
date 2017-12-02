var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}).done(function (results) {

  // Regularly required labels/variables.
  var cLabels = results.channelLabels;
  var sLabels = results.supporterLabels;
  var backgroundColours = ["#3e95cd", "#8e5ea2","#3cba9f", "#e8c3b9", "#c45850"];

  // Functions! (The model?)

  // Charts function

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

  // Tables function

  function tables(type,location) {

    // Build the title row
    var tColumnTitles = "";

    tColumnTitles += "<th></th>" // Empty cell at the beginning

    for ( var i = 0; i < cLabels.length; i++ ) {
      tColumnTitles += "<th>" + cLabels[i].toUpperCase() + "</th> "
    };

    // Build each row
    var tRowsCollections = [];
    for ( var i = 0; i < sLabels.length; i++ ) {

      var tcells = [];

      // The row title
      tcells += ["<th scope='row'>" + sLabels[i].toUpperCase() + "</th>"];

      // Each content cell
      for ( var x = 0; x < cLabels.length; x++ ) {
        tcells += ["<td>" + results[type][sLabels[i]][cLabels[x]] + "</td>"];
      };

      tRowsCollections += ["<tr>" + tcells + "</tr>"];

    };

    return $(location).append("<thead><tr>" + tColumnTitles + "</tr></thead><tbody>" + tRowsCollections + "</tbody>");

  };

  // Page titles

  function pageTitles() {

    // Edit the page headings with the totalShifts
    $("#totalShifts").append(results.collections.total);
    $("#totalCollectors").append(results.collectors.total);

  };


  // Calling the functions (The view?)

  theChart('collections','chart1');
  tables('collections', '#table1');

  theChart('collectors','chart2');
  tables('collectors', '#table2');

  pageTitles();


});
