var ymerge = new Array(y.length);
ymerge.fill(0);
var xmerge = d3.range(y.length);

var orgbc = new barchart(d3.select("#orgbarchart"), xmerge, y)
orgbc.initChart();
var mergebc = new barchart(d3.select("#mergebarchart"), xmerge, y);
mergebc.initChart();
mergebc.drawBars(ymerge);

// Map from original index of a val in array to current index



function mergesort(arr, verbose=0) {
  // values to compare
  this.y = arr;
  // map from current sorted index to original index
  // i is the current sorted index, x[i] is the original index
  // y[x[i]] are the values being compared
  this.x = d3.range(arr.length);
  // map from future sorted index to original index
  this.nextx = [];
  // Groups are groups of the current indices
  this.groups = this.x.map(val => [val]);
  this.nextgroups = [];

  // Should console.log be printed?
  this.verbose = verbose > 0;
}

mergesort.prototype.pullfromgroups = function() {
  if (this.groups.length >= 2) {
    [this.g1, this.g2] = this.groups.splice(0,2);
    return true;
  } else if (this.groups.length == 1) {
    this.g1 = this.groups.shift();
    // g2 should be empty if we're here.
    return false;
  }
}

mergesort.prototype.compare = function() {
  var [ind1, ind2] = [this.g1.slice(0,1), this.g2.slice(0,1)];

  if (this.y[this.x[this.g1[0]]] <= this.y[this.x[this.g2[0]]]) {
    this.nextx.push(this.x[this.g1[0]]);
    this.g1.shift();
  } else {
    this.nextx.push(this.x[this.g2[0]]);
    this.g2.shift();
  }

  return [ind1[0], ind2[0]];
}

mergesort.prototype.appendleftovers = function() {
  while (this.g1.length > 0) {
    this.nextx.push(this.x[this.g1[0]]);
    this.g1.shift();
  }
  while (this.g2.length > 0) {
    this.nextx.push(this.x[this.g2[0]]);
    this.g2.shift();
  }
}

mergesort.prototype.mergegroups = function() {
  this.nextgroups.push(this.g1.concat(this.g2));

  while (this.g1.length > 0 && this.g2.length > 0) {
    this.compare();
  }

  this.appendleftovers();
}

mergesort.prototype.pass = function() {
  while (this.groups.length > 0) {
    this.pullfromgroups();
    this.mergegroups();
  }
}

mergesort.prototype.run = function() {
  this.numberofpasses = 0;

  while (this.groups.length > 1 && this.numberofpasses < 1000) {
    this.numberofpasses += 1;
    this.pass();
    this.groups = this.nextgroups.slice();
    this.nextgroups = [];
    this.x = this.nextx.slice();
    this.nextx = [];
  }

  return [this.x, this.x.map(ind => y[ind])]
}


var m = new mergesort(y);

m.pullfromgroups();
m.nextgroups.push(m.g1.concat(m.g2));

currentState = "merge";


function step() {
  console.log("Step");

  if (currentState == "merge") {
    var [ind1, ind2] = m.compare();
    console.log([ind1, ind2]);
    orgbc.selectBars([ind1, ind2]);
    currentState = "redraw";
  }
  else if (currentState == "redraw") {
    mergebc.drawBars(m.nextx.map(ind => y[ind]));

    if (m.g1.length == 0 || m.g2.length == 0) {
      m.appendleftovers();
      m.pullfromgroups();
      m.nextgroups.push(m.g1.concat(m.g2));
    }

    currentState = "merge";

    if (m.groups.length == 1) {
      m.pullfromgroups();
      m.nextgroups.push(m.g1.concat(m.g2));
      m.appendleftovers();
      mergebc.drawBars(m.nextx.map(ind => y[ind]));
      currentState = "nextpass";
    } else if (m.groups.length <1) {
      currentState = "nextPass";
      mergebc.drawBars(m.nextx.map(ind => y[ind]));
      clearInterval(interMerge);
    }
  }
}


var interMerge = setInterval(step, 250);
