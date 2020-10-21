var svg = document.getElementById("barchart");
var rect = svg.getBoundingClientRect();
console.log(svg);
console.log(rect);

var svg = d3.select("#barchart");

var y = [];
while (y.length < 20) {
  y.push(Math.round(Math.random()*255));
}

var bc = new barchart(svg, rect, y);
bc.initChart();


var i = 1;
var maxi = y.length;

function step() {
  if (i>=maxi) {
    i=1;
    maxi = maxi-1;
  }
  if (maxi <= 0) {
    clearInterval(inter);
  }
  bc.selectBars([i-1,i]);
  if (y[i] < y[i-1]) {
    console.log(`Swapping ${i} and ${i-1}`);
    y.swap(i,i-1);
    all_sorted = false;
  }
  bc.drawBars(y);
  i = i+1;
}

var inter = setInterval(step,100);
