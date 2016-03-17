// // Xiaolin Wu's line algorithm
// // https://en.m.wikipedia.org/wiki/Xiaolin_Wu%27s_line_algorithm

function ipart(x) {
  return Math.floor(x);
}

function fpart(x) {
  return x - Math.floor(x);
}

function rfpart(x) {
  return 1 - fpart(x);
}

function xiaolinWuLineIterator(x1, y1, x2, y2, plot) {
  var swapPlot = function(swapAxes, x, y, c) {
    if (swapAxes) plot(y, x, c);
    else plot(x, y, c);
  };

  var dx = x2 - x1;
  var dy = y2 - y1;
  var swapAxes = false;

  if (Math.abs(dx) < Math.abs(dy)) {
    swapAxes = true;
    var t;
    t = x1;
    x1 = y1;
    y1 = t;
    t = x2;
    x2 = y2;
    y2 = t;
    t = dx;
    dx = dy;
    dy = t;
    //swap x1, y1
    //swap x2, y2
    //swap dx, dy
  }
  if (x2 < x1) {
    //swap x1, x2
    //swap y1, y2
    t = x1;
    x1 = x2;
    x2 = t;
    t = y1;
    y1 = y2;
    y2 = t;
  }
  var gradient = dy / dx;

  // handle first endpoint
  var xend = Math.round(x1);
  var yend = y1 + gradient * (xend - x1);
  var xgap = rfpart(x1 + 0.5);
  var xpxl1 = xend; // this will be used in the main loop
  var ypxl1 = ipart(yend);

  swapPlot(swapAxes, xpxl1, ypxl1, rfpart(yend) * xgap);
  swapPlot(swapAxes, xpxl1, ypxl1 + 1, fpart(yend) * xgap);
  var intery = yend + gradient; // first y-intersection for the main loop

  // handle second endpoint
  xend = Math.round(x2);
  yend = y2 + gradient * (xend - x2);
  xgap = fpart(x2 + 0.5);
  var xpxl2 = xend; // this will be used in the main loop
  var ypxl2 = ipart(yend);
  swapPlot(swapAxes, xpxl2, ypxl2, rfpart(yend) * xgap);
  swapPlot(swapAxes, xpxl2, ypxl2 + 1, fpart(yend) * xgap);

  // main loop
  for (x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
    swapPlot(swapAxes, x, ipart(intery), rfpart(intery));
    swapPlot(swapAxes, x, ipart(intery) + 1, fpart(intery));
    intery = intery + gradient;
  }
}
