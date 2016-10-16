define(function(){
  function Display() {
    
    this.scale = 1;
    this.origin = {
      x: 0,
      y: 0
    }

    this.zoom = function(ctx, c, p, factor) {
      var originX = this.origin.x;
      var originY = this.origin.y;
      var scale = this.scale;

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.translate(originX, originY);
      ctx.scale(factor, factor);
      ctx.translate(
            -( p.x / scale + originX - p.x / ( scale * factor ) ),
            -( p.y / scale + originY - p.y / ( scale * factor ) )
        );

      this.origin.x = originX = ( p.x / scale + originX - p.x / ( scale * factor ) );
      this.origin.y = ( p.y / scale + originY - p.y / ( scale * factor ) );
      this.scale *= factor;
    }

    return this;
  }
  
  return Display;
});