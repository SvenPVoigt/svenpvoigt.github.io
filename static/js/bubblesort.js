var svg = d3.select("#bubblebarchart");

var ybubble = [...y];

var bubblebc = new barchart(svg, ybubble);
bubblebc.initChart();

// Add local scope to iterator variables
{
  var iterBubble = 1;
  var maxiterBubble = ybubble.length;

  function stepBubble() {
    if (iterBubble >= maxiterBubble) {
      iterBubble = 1;
      maxiterBubble = maxiterBubble-1;
    }
    console.log(iterBubble);
    if (maxiterBubble <= 1) {
      clearInterval(interBubble);
    }
    bubblebc.selectBars([iterBubble-1,iterBubble]);
    if (ybubble[iterBubble] < ybubble[iterBubble-1]) {
      console.log(`Swapping ${iterBubble} and ${iterBubble-1}`);
      ybubble.swap(iterBubble,iterBubble-1);
      all_sorted = false;
    }
    bubblebc.drawBars(ybubble);
    iterBubble = iterBubble+1;
  }

  var interBubble = setInterval(stepBubble,100);
}
