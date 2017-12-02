var ajaxProcess = $.ajax({
  url: '../data/processed/byChannel.json',
  dataType: 'json',
}
).done(function (results) {

    // Simplifying some items that have to be referred to further down.
    var cLabels = results.channelLabels;
    var sLabels = results.supporterLabels;

    var theGraph = 'collections';

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

    }

    tables('collections', '#table1');
    tables('collectors', '#table2');

});
