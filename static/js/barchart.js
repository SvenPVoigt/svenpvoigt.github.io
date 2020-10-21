function barchart(svg, rect, x, y, c, margin={top: 25, right: 25, bottom: 25, left: 25}) {
  if (typeof(x)=="undefined") {
    return;
  } else if (typeof(y)=="undefined") {
    y = x.slice();
    x = d3.range(x.length);
  }

  if (typeof(c)=="undefined") {
    this.cList = new Array(x.length);
    this.cList.fill("#555");
  } else if (!Array.isArray(c)) {
    this.cList = new Array(x.length);
    this.cList.fill(c);
  }

  this.x = x;
  this.y = y;
  this.margin = margin;

  this.height = rect.height;
  this.width = rect.width;
}


barchart.prototype.makeData = function() {
  return this.x.map((val, i) => {return {x: val, y: this.y[i]}})
}


barchart.prototype.initChart = function() {
  xScale = d3.scaleBand()
    .domain(this.x)
    .range([this.margin.left, this.width - this.margin.right])
    .padding(0.1);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(this.y)]).nice()
    .range([this.height - this.margin.bottom, this.margin.top]);

  xAxis = g => g
    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(i => this.x[i]).tickSizeOuter(0));

  yAxis = g => g
    .attr("transform", `translate(${this.margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(null))
    .call(g => g.select(".domain").remove());

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  this.bars = svg.append("g");

  this.drawBars();
}

barchart.prototype.selectBars = function(ind, c="#5d5", cDefault="#555") {
  this.cList.fill(cDefault);
  ind.forEach(i => {this.cList[i] = c});
  this.drawBars();
}

barchart.prototype.drawBars = function(y) {
  if (typeof(y)!="undefined") {
    this.y=y;
  }
  var data = this.makeData();

  this.bars.selectAll("rect")
  .data(data)
    .join("rect")
    .attr("x", (d,i) => xScale(d.x))
    .attr("y", d => yScale(d.y))
    .attr("height", d => yScale(0) - yScale(d.y))
    .attr("width", xScale.bandwidth())
    .attr("fill", (d,i) => this.cList[i]);
}
