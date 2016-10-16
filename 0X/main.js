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
  var size = 405;
  var c = document.createElement('CANVAS');
  c.height = size;
  c.width = size;
  c.style.border = "1px solid white";

  document.body.appendChild(c);
  
  var cUi = document.createElement('CANVAS');
  cUi.height = size;
  cUi.width = size;
  cUi.style.border = "1px solid white";

  document.body.appendChild(cUi);

  drawGrid(cUi, 3, 3);
  
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
  
  var path = [];
  cUi.onclick = function(e) {
    var factor = 3;
    var zoomFactor = (e.shiftKey) ? 1/factor : factor;
    var squareSize = size / 3;
    var x = Math.ceil(Math.abs(e.offsetX) / squareSize) - 1;
    var y = Math.ceil(Math.abs(e.offsetY) / squareSize) - 1;
    var square = 3 * y + x;
    path = path.concat([square]);
    //display.zoom(ctx, c, {x: ((x % 3) * squareSize) + squareSize * (x / 2), y: Math.floor(y % 3) * squareSize + squareSize * (y / 2)}, zoomFactor);
    
    ctx.clearRect(0, 0, c.width, c.height);
    worker.postMessage({
      path: path, 
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
    
    drawMove(cUi, square, path.length-1);
    //drawMoves(c, path);
  }
  
  c.onmousedown = function(e) {
    var factor = 1.5;
    var zoomFactor = (e.shiftKey) ? 1/factor : factor;
    display.zoom(ctx, c, {x: e.offsetX, y: e.offsetY}, zoomFactor);
    
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

function drawGrid(canvas, rows, cols) {
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#fff';
  
  ctx.beginPath();
  
  for (var row = 0; row < rows; row++) {
    var y = row * canvas.height / rows;
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  
  for (var col = 0; col < rows; col++) {
    var x = col * canvas.width / cols;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  
  ctx.stroke();
}

function drawMove(canvas, square, turn) {
  var p1Turn = turn % 2 === 0;
  var size = Math.floor(canvas.width / 3);
  var text = (p1Turn) ? "0" : "X";
  var col = (p1Turn) ? "#f00" : "#0f0";
  var ctx = canvas.getContext('2d');
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = size + "px Verdana";
  ctx.fillStyle = col
  ctx.fillText(text, (square % 3) * size + size/2, Math.floor(square / 3) * size + size/2);
}

function drawMoves(canvas, path) {
  for (var i = 0; i < path.length; i++) {
    drawMove(canvas, path[i], i);
  }
}