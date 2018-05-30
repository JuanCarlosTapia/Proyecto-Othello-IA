// Juan Carlos Tapia Flores   14133
// Proyecto final

var othello = require('./othello-logic.js');

var turn = 0;

var socket = require('socket.io-client')('http://192.168.1.149:3000');  // for example: http://127.0.0.1:3000
socket.on('connect', function(){});

socket.on('connect', function(){
  socket.emit('signin', {
  user_name: "juanca",
  tournament_id: 12,
  user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});


socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  console.log(convertToMatrix(board));

  // Se obtiene el siguiente movimiento.
  var move = getMove(convertToMatrix(board), playerTurnID);
  

  socket.emit('play', {
  tournament_id: 12,
  player_turn_id: playerTurnID,
  game_id: gameID,
  movement: move

  });


});


socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  
  console.log('Game Over. ');
  console.log(convertToMatrix(board));

  // TODO: Your cleaning board logic here
  
  socket.emit('player_ready', {
  tournament_id: 12,
  player_turn_id: playerTurnID,
  game_id: gameID
  });
});


function getMove(board, player) {

 //console.log(board);
  var option =  max_value(board, 0, -9999999, 9999999, player, true) //Math.floor(Math.random() * 64);
  console.log(option);
  return option[0]*8+option[1];  
}


function validMove(board, moveNum) {
  if (board[moveNum] == 0) 
  return true;
  else
  return false;
}

function convertToMatrix(board) { 
  var mat = new Array(8);
  for (var i = 0; i < 8; i++) {
  mat[i] = new Array(8); 
  }

  var cont = 0;
  for (var i = 0; i < 8; i++) {
  for (var j = 0; j < 8; j++) {
     mat[i][j] = board[cont];
     cont +=1; 
  }
   
  }

  return mat;

}


function marcadorActual (board, player){
   var puntuacion = 0;
    for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
       if (board[i][j] == player) {
          puntuacion +=1; 
        }
        if (board[i][j] ==  othello.data.otherPlayer(player)) {
          puntuacion -=1; 
        
      }
    }
  } 
  return puntuacion;
}


function value (board, depth, a, b, player, move) {
  if (depth == 7) {
    return marcadorActual(board, player);
  } 


    if (move == 'max') {
      return max_value(board, depth, a, b, player, false);
  }

  if (move == 'min') {
      return min_value(board, depth, a, b, player);
  }

  
  return 0;

}   


function max_value (board, depth, a, b, player, returnMove) {
      //console.log('MAX ', depth);

      var validMoves = othello.data.validosAll(player, board);
     // console.log(validMoves);
      var newBoards =  [];
      var cont = 0;
      for (var i = 0; i < validMoves.length; i++) {
        var newBoard = [];
        board.forEach((v, i) => {
          newBoard.push(board[i].slice());
        });
        newBoards.push(othello.data.newBoardAfterMove(validMoves[i][0], validMoves[i][1], player, newBoard));
       // console.log(newBoards[i])
        cont+=1;
      }

      var v = -9999999;
      for (var i = 0; i < newBoards.length; i++) {
      v = Math.max(v, value(newBoards[i], depth+1, a, b, player, 'min'));

      if (v >= b) {
        if (returnMove) {
            return validMoves[i];
          }
        return v;
      }
      a = Math.max(a, v)
      }

      if (returnMove) {
        return validMoves[validMoves.length-1];
      }
      return v;

}

function min_value (board, depth, a, b, player) {
  //console.log('MIN ', depth);

  var validMoves = othello.data.validosAll(othello.data.otherPlayer(player), board);
 // console.log(validMoves);
  var newBoards =  [];
  var cont = 0;
  for (var i = 0; i < validMoves.length; i++) {
    var newBoard = [];
    board.forEach((v, i) => {
      newBoard.push(board[i].slice());
    });
    newBoards.push(othello.data.newBoardAfterMove(validMoves[i][0], validMoves[i][1], othello.data.otherPlayer(player), newBoard));
  //  console.log(newBoards[i])
    cont+=1;
  }

  var v = 9999999;
  for (var i = 0; i < newBoards.length; i++) {
    v = Math.min(v, value(newBoards[i], depth+1, a, b, player, 'max'));

    if (v <= a) {
      return v;
    }
    b = Math.min(b, v)
  }
  return v;
}


