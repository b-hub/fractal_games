importScripts("../lib/require.js");

var importsLoaded = false;
var gameover = function(){};

require(['0X'], function(game) {
  gameover = game.gameover;
  importsLoaded = true;
});

onmessage = handleMessage;
  
function handleMessage(e) {
  var data = e.data;
  if (importsLoaded) {
    render(data.path, data.ref, data.display, data.options);
  
  } else {
    setTimeout(handleMessage, 0, e);
  }
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
    return;
  }

  if (path.length == 9) {
    postMessage({type: 'draw', pathLength: path.length, ref: ref});
    return;
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