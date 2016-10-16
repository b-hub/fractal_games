var size = 405;
var c = document.createElement('CANVAS');
c.height = size;
c.width = size;
c.style.border = "1px solid white";

document.body.appendChild(c);
var ctx = c.getContext('2d');

drawGrid(c, 3, 3);

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

function getSquare(e) {
  var relativeSize = size / 3;
  var x = Math.ceil(Math.abs(e.offsetX) / relativeSize) - 1;
  var y = Math.ceil(Math.abs(e.offsetY) / relativeSize) - 1;
  return 3 * y + x;
}

c.onclick = function(e) {
  var square = getSquare(e);
}

/*
var currSquare;

function highlight(square) {
  if (square === currSquare)
    return;
  var squareSize = size / 3;
  ctx.beginPath();
  ctx.strokeStyle = '#ff0';
  ctx.lineWidth = 2;
  ctx.rect((square % 3) * squareSize, Math.floor(square / 3) * squareSize, squareSize, squareSize);
  ctx.stroke();
  currSquare = square;
}

c.onmousemove = function(e) {
  highlight(getSquare(e));
}
*/