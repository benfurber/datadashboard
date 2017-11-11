d3.csv("/sample-data/canvas1.csv", function(data) {

  // Sort orders
  var type_order = ["Cold", "Warm", "Loyal"];
  var channel_order = ["Search", "PPC", "Email", "Offline"];

  var shiftsByType = d3.nest()
    .key(function(d) { return d.supporterType; }).sortKeys(function(a,b) { return type_order.indexOf(a) - type_order.indexOf(b); })
    .rollup(function(v) { return {
      count: v.length,
    }; })
    .entries(data);

  var typeAndChannel = d3.nest()
    .key(function(d) { return d.supporterType; }).sortKeys(function(a,b) { return type_order.indexOf(a) - type_order.indexOf(b); })
    .key(function(d) { return d.channel; }).sortKeys(function(a,b) { return channel_order.indexOf(a) - channel_order.indexOf(b); })
    .rollup(function(v) { return v.length })
    .object(data);

  console.log(shiftsByType);
  console.log(typeAndChannel)
  console.log(JSON.stringify(typeAndChannel));
  console.log(typeAndChannel[0]);

  var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

  svg.selectAll("rect")
    .data(typeAndChannel)
    .enter()
      .append("rect")
      .attr("width", function (d) { return d.object.length * 100; })
      .attr("height", 48)
      .attr("y", function (d, i) { return i * 50; })
      .attr("x", 50)
      .style("fill", "green");

  svg.selectAll("text") // Text label
    .data(typeAndChannel)
    .enter()
      .append("text")
      .attr("fill", "black")
      .attr("y", function (d, i) { return i * 50 + 26; })
      .text(function (d) { return d.key ; });


});
