var svg = d3.select("#mergebarchart");

var ymerge = [...y];
var xmerge = d3.range(y.length);

var mergebc = new barchart(svg, xmerge, ymerge);
mergebc.initChart();

// Map from original index of a val in array to current index



function mergesort(verbose=0) {
  // Possible states: "start", "rebuild", "evaluate", "vismerge", "nextpiece"
  this.currentState = "start";
  this.nextypieces = [];
  this.nextxpieces = [];
  this.ypieces;
  this.xpieces;
  this.numiters = 0;
  this.mergedy = [];
  this.mergedx = [];
  // Map from original index of a val in array to current index
  this.indmap = d3.range(y.length);
  this.v = verbose>0;

  if (this.v) {console.log("initialized");}
}

// Modifies this.vals1, this.vals2, this.inds1, this.inds2, this.mergedy, this.mergedx
// inds is the original index
mergesort.prototype.evaluate = function() {
  if (this.vals1.length==0 && this.vals2.length!=0) {
    for (i=0;i<this.vals2.length;i++) {
      this.mergedy.push(this.vals2.shift());
      this.mergedx.push(this.inds2.shift());
    }
  } else if (this.vals1.length!=0 && this.vals2.length==0) {
    for (i=0;i<this.vals1.length;i++) {
      this.mergedy.push(this.vals1.shift());
      this.mergedx.push(this.inds1.shift());
    }
  } else {
    y1 = this.vals1[0];
    y2 = this.vals2[0];
    x1 = this.inds1[0];
    x2 = this.inds2[0];

    console.log(x1);
    console.log(x2);

    mergebc.selectBars([ this.indmap[x1], this.indmap[x2] ]);

    if (y1 <= y2) {
      this.mergedy.push(this.vals1.shift());
      this.mergedx.push(this.inds1.shift());
      // Keeps same index this.indmap[x1] = this.indmap[x1];
    } else {
      this.mergedy.push(this.vals2.shift());
      this.mergedx.push(this.inds2.shift());

      // console.log(`Moving value at ${this.indmap[x2]} to ${this.indmap[x1]}`);
      this.indmap[x2] = this.indmap[x1];

      for (i=0; i<this.inds1.length; i++) {
        // console.log(`Moving value at ${this.indmap[x2]} to ${this.indmap[x1]}`);
        this.indmap[this.inds1[i]] += 1;
      }
    }
  }
}

mergesort.prototype.step = function() {
  this.numiters += 1;

  if (this.currentState=="start") {
    if (this.v) {console.log("starting");}
    this.ypieces = ymerge.transpose1d();
    this.xpieces = xmerge.transpose1d();

    this.currentState = "nextpiece";
  }
  else if (this.currentState=="rebuild") {
    if (this.v) {console.log("rebuilding");}
    this.ypieces = this.nextypieces.slice(1);
    this.xpieces = this.nextxpieces.slice(1);
    this.nextypieces = [];
    this.nextxpieces = [];

    this.currentState = "nextpiece";

    clearInterval(interMerge);
  }
  else if (this.currentState=="evaluate") {
    if (this.v) {console.log("evaluating");}

    this.evaluate();

    this.currentState = "vismerge";

    // clearInterval(interMerge);
  }
  else if (this.currentState=="vismerge") {
    if (this.v) {console.log("visualizing merge");}
    mergebc.drawBars(this.indmap, ymerge)

    if (this.vals1.length!=0 || this.vals2.length!=0) {
      this.currentState = "evaluate";
    } else {
      this.currentState = "nextpiece";
    }
  }
  else if (this.currentState=="nextpiece") {
    if (this.v) {console.log("getting next piece");}
    if (this.ypieces.length < 2) {
      if (this.ypieces.length > 0) {
        this.nextypieces.push(this.ypieces.shift());
        this.nextxpieces.push(this.xpieces.shift());
      }

      this.currentState = "rebuild";
    } else {
      // Save the results
      this.nextypieces.push(this.mergedy.slice());
      this.nextxpieces.push(this.mergedx.slice());
      this.vals1 = this.ypieces.shift();
      this.vals2 = this.ypieces.shift();
      this.inds1 = this.xpieces.shift();
      this.inds2 = this.xpieces.shift();
      this.mergedy = [];
      this.mergedx = [];
      this.currentState = "evaluate";
    }
  }
  // clearInterval(interMerge);
}

var merger = new mergesort(1);

var interMerge = setInterval(function(){merger.step();}, 250);
