function getUrlParameter(){
  var pattern = window.location.href;
  pattern = pattern.split(/[?&]/);
  pattern.shift();
  var parameters = {}
  for (var i = 0; i < pattern.length; i++) {
    var value = pattern[i].split(/[=]/)[1];
    value = value.replace("+", " ");
    parameters[pattern[i].split(/[=]/)[0]] = value;
  };
  return parameters;
}

$(function(){
    var derivers = $.pivotUtilities.derivers;
    var paras = getUrlParameter();

    $.getJSON("data/processed/pivottable.json", function(results) {
        $("#output").pivotUI(results, {
          rows: [paras.rows],
          cols: [paras.cols],
          sorters: { 'Supporter Type': $.pivotUtilities.sortAs(["Cold", "Warm","Loyal"]) },
        });
    });

    document.title = "Pivot Table Builder - " + paras.rows + " and " + paras.cols;

 });
