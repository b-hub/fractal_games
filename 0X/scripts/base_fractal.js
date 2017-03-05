define(function(){
  function BaseRenderer(ctx, fCols) {
  
    function draw(path, ref, display, options) {
      var origin = display.origin;
      var scale = display.scale;
      var c = display.canvas;

      if (ref.x + ref.width < origin.x || ref.y + ref.width < origin.y || ref.y > origin.y + c.height / scale || ref.x > origin.x + c.width / scale) {
        return;
      }

      var subWidth = ref.width / 3;

      if (subWidth * scale < options.minWidth) {
        ctx.fillStyle = fCols[path.length - 2];
        ctx.fillRect(ref.x, ref.y, ref.width, ref.width);
        return;
      }

      for (var i = 0; i < 9; i++) {
        var depth = path.indexOf(i);
        var subX = ref.x + subWidth * (i % 3);
        var subY = ref.y + subWidth * Math.floor(i / 3);
        if (depth == -1) {
          draw(
            path.concat([i]),
            {
              x: subX, 
              y: subY, 
              width: subWidth
            }, 
            display,
            options
          );
        } else {
          ctx.fillStyle = fCols[depth];
          ctx.fillRect(subX, subY, subWidth, subWidth);
        }
      }
    }
    
    function smooth(canvas) {
      var ctx = canvas.getContext('2d');
      var width = canvas.width;
      var height = canvas.height;
      var imgData = ctx.getImageData(0, 0, width, height);
      var data = imgData.data;
      var pixels = [];
      for (var i = 0; i < data.length / 4 / width; i++) {
        var row = [];
        for (var j = 0; j < 4; j++) {
          
        }
        pixels.push();
      }
      var r = 2;
      var maxRow = height - r;
      var maxCol = width - r;
      for (var i = 0; i < data.length; i+= 4) {
        var row = Math.floor(i / width);
        var col = i % width;
        if (row < 2 || col < 2 || row > maxRow || col > maxCol) continue;
        
        averageCol(data, pixel, row, col, 2)
        
      }
    }
    
    function averageCol(data, pixel, x, y, r) {
      var total = 0;
      for (var i = 0; i <= r, i++) {
        for (var j = 0; j <= r; j++) {
          data[]
        }
      }
    }

    this.draw = draw;
    
    return this;
  }
  
  return BaseRenderer;
});