console.log("worker");

var gameoverMapping = [
  [[1,2],[4,8],[3,6]],
  [[0,2],[4,7]],
  [[1,0],[4,6],[5,8]],
  [[0,6],[4,5]],
  [[1,7],[3,5],[0,8],[2,6]],
  [[8,2],[4,3]],
  [[0,3],[4,2],[7,8]],
  [[6,8],[1,4]],
  [[6,7],[5,2],[0,4]],
];

function gameover(path) {
  if (path.length < 5) return false;
  var lastPlayer = (path.length-1) % 2;
  var lastPlayerMoves = path.filter(function(move, i) {
    return i % 2 === lastPlayer;
  });

  return gameoverMapping[path[path.length-1]].some(function(ops){
    return ops.every(function(op){
      return lastPlayerMoves.indexOf(op) != -1; 
    });
  });
}

onmessage = function(e) {
  var data = e.data;
  render(data.path, data.ref, data.display, data.options)
}

function render(path, ref, display, options) {
  
  var origin = display.origin;
  var scale = display.scale;
  var c = display.canvas;
  
  if (ref.x + ref.width < origin.x || ref.y + ref.width < origin.y || ref.y > origin.y + c.height / scale || ref.x > origin.x + c.width / scale) {
    return;
  }

  if (gameover(path)) {
    postMessage({type: 'gameover', pathLength: path.length, ref: ref});
  }

  if (path.length == 9) {
    postMessage({type: 'draw', pathLength: path.length, ref: ref});
  }

  var subWidth = ref.width / 3;

  if (subWidth * scale < options.minWidth) return;

  for (var i = 0; i < 9; i++) {
    
    if (path.indexOf(i) == -1) {
      render(
        path.concat([i]),
        {
          x: ref.x + subWidth * (i % 3), 
          y: ref.y + subWidth * Math.floor(i / 3), 
          width: subWidth
        }, 
        display,
        options
      );
    } else {
      continue;
      postMessage({
        type: 'inProgress',
        pathLength: path.length, 
        ref: {
          x: ref.x + subWidth * (i % 3), 
          y: ref.y + subWidth * Math.floor(i / 3), 
          width: subWidth
        }
      });
    }
  }
}