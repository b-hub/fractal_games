define(function () {

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

  return {
    gameover: gameover
  };
});
