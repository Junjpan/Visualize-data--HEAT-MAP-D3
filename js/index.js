d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", (err, data) => {
  if (err) throw error;
  const dataSet = data.monthlyVariance;
  console.log(dataSet);
  const leftMargin = 100;
  const width = 1400;
  const height = 1000;
  const cellWidth = (width - 100) / ((dataSet.length - 9) / 12 + 1);
  const cellHeight = (height - 150) / 12;
  const tempArray = dataSet.map(d => {
    return Math.round((d.variance + data.baseTemperature) * 10) / 10;
  });


  const canvas = d3.select("body").append("svg").
  attr("width", width).
  attr("height", height).
  append("g").attr("transform", "translate(" + leftMargin + ",50)");
  const colorRange = ["#ffcc99", "#ff9966", "#ffcc66", "#ffcc00", "#ff9933", "#cc6600", "#ff3300", "#ff0000"];

  console.log(d3.extent(tempArray, d => d));
  const color = d3.scale.threshold().
  domain([1.7, 3.9, 6.1, 8.3, 10.6, 11.7, 13.9]).
  range(colorRange);
  const yScale = d3.scale.linear().
  domain([0, 11]).
  range([0, height - 150]);
  var yAxis = d3.svg.axis().
  ticks(12)
  //.tickValues(yScale.domain()) pass the value to tickformat optional
  .tickFormat(month => {
    const date = new Date(0);
    date.setUTCMonth(month);
    return d3.time.format.utc("%B")(date);
  }).
  scale(yScale).
  orient("left").
  tickSize(10, 3);
  const xScale = d3.scale.linear().
  domain(d3.extent(dataSet, d => d.year)).
  range([0, width - 100]);

  const xAxis = d3.svg.axis().
  ticks(20).
  scale(xScale).
  orient("bottom").
  tickSize(10, 3);
  const tooltip = d3.select("body").append("div").
  attr("id", "tooltip");
  canvas.append("g").
  attr("transform", "translate(0," + (height - 150) + ")").
  attr("id", "x-axis").
  call(xAxis).
  selectAll("text").
  attr("transform", "rotate(-60)").
  attr("fill", "white").
  attr("dy", "1em").
  attr("dx", "-1.5em").
  attr("text-anchor", "end");

  canvas.append("g").
  attr("transform", "translate(0,0)").
  attr("id", "y-axis").
  call(yAxis).
  selectAll("text").
  attr("fill", "white");

  function mouseoverhandler(d) {
    d3.select(this).
    style("opacity", 0.8);
    tooltip.style("opacity", 1);
    const date = new Date(0);
    date.setUTCMonth(d.month);
    const month = d3.time.format.utc("%B")(date);

    tooltip.style("left", d3.event.pageX + 5 + "px").
    style("top", d3.event.pageY + 5 + "px").
    html(d.year + "-" + month + "<br>" + d.variance + "&#8451;" + "<br>" + Math.round((d.variance + data.baseTemperature) * 10) / 10 + "&#8451;");
  }

  function mouseouthandler(d) {
    d3.select(this).
    style("opacity", 1);
    tooltip.style("opacity", 0);
  }

  canvas.selectAll(".cell").
  data(dataSet).
  enter().
  append("rect").
  attr("class", "cell").
  attr("data-year", d => d.year).
  attr("data-month", d => d.month).
  attr("data-temp", d => d.temp).
  attr("x", (d, i) => Math.floor(i / 12) * cellWidth).
  attr("y", (d, i) => i < 12 ? cellHeight * i : cellHeight * (i % 12)).
  attr("width", cellWidth).
  attr("height", cellHeight).
  attr("stroke", "white").
  attr("fill", d => color(d.variance + data.baseTemperature)).
  on("mouseover", mouseoverhandler).
  on("mouseout", mouseouthandler);

  canvas.selectAll(".legend").
  data(colorRange).
  enter().
  append("rect").
  attr("class", "legend").
  attr("x", (d, i) => 50 + i * 40).
  attr('y', (d, i) => height - 95).
  attr("width", 40).
  attr("height", 20).
  attr("fill", d => d).
  attr("stroke", "black");

  const xLegendScale = d3.scale.linear().
  domain(d3.extent(dataSet, d => Math.round((d.variance + data.baseTemperature) * 10) / 10)).
  range([50, 50 + colorRange.length * 40]);

  const xLegendAxis = d3.svg.axis().
  tickValues([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8]).
  tickFormat(d3.format("0.0")) //set the tick number format
  .scale(xLegendScale).
  orient("bottom").
  tickSize(10, 1);
  console.log(xLegendAxis);

  canvas.append("g").
  attr("transform", "translate(0," + (height - 75) + ")").
  call(xLegendAxis);
  console.log(canvas);

});