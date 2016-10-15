require(['config'], function() {
  require(['0X', 'display'], function(game, Display) {
    main(game, Display);
  });
});

var drawQ = [];
function drawQueued() {
  for (var i = 0; i < drawQ.length; i++) {
    drawQ[i]();
  }
  drawQ = [];
  requestAnimationFrame(drawQueued);
}

function main(game, Display) {
  console.log("start");
  var size = 405;
  var c = document.createElement('CANVAS');
  c.height = size;
  c.width = size;
  c.style.border = "1px solid white";

  document.body.appendChild(c);
  var ctx = c.getContext('2d');
  
  var display = new Display();
  
  var fCols = fractalCols(9, function(x){
    return "#" + x + x + x;
  });
  
  var worker = new Worker("scripts/worker.js");
  
  worker.onmessage = function(e){
    var data = e.data;
    var ref = data.ref;
    switch (data.type) {
      case "gameover":
        drawQ.push(function() {
          ctx.fillStyle = (data.pathLength % 2 == 1) ? "#f00" : "#0f0";
          ctx.fillRect(ref.x, ref.y, ref.width, ref.width);
        });
        break;
      case "draw":
        drawQ.push(function() {
          ctx.fillStyle = "#00f";
          ctx.fillRect(ref.x, ref.y, ref.width, ref.width);
        });
        break;
      case "inProgress":
        drawQ.push(function() {
          ctx.fillStyle = fCols[data.pathLength];
          ctx.fillRect(ref.x, ref.y, ref.width, ref.width);
        });
        break;
    }
  };
  
  worker.postMessage({
    path: [], 
    ref: {x: 0, y: 0, width: c.width, height: c.height}, 
    display: {
      scale: display.scale, 
      origin: display.origin, 
      canvas: {width: c.width, height: c.height}
    }, 
    options: {
      minWidth: 0.5
    }
  });
  
  c.onmousedown = function(e) {
    display.zoom(ctx, c, {x: e.offsetX, y: e.offsetY}, 1.5);
    
    worker.postMessage({
      path: [], 
      ref: {x: 0, y: 0, width: c.width, height: c.height}, 
      display: {
        scale: display.scale, 
        origin: display.origin, 
        canvas: {width: c.width, height: c.height}
      }, 
      options: {
        minWidth: 0.5
      }
    });
  }
  

  
  drawQueued();
}

function fractalCols(n, colCreator) {
    cols = [];
    for (var i = n; i > 0; i--) {	
      var x = Number(Math.floor(i / n * 255)).toString(16);
      cols.push(colCreator(x));
    }

    return cols;
}