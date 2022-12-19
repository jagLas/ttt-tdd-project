const TTT = require('./ttt')

class ComputerPlayer {

  static getValidMoves(grid) {
    const validMoves = [];  //creates an array for valid moves
    for (let row = 0; row < grid.length; row++){
      for (let col = 0; col <grid[0].length; col++) { //iterates through each space
        let space = grid[row][col];
        if (space === ' ') {
          let move = {row: row, col: col};
          validMoves.push(move);
        }
      }
    }
    return validMoves;
  }

  static randomMove(grid) {
    const validMoves = this.getValidMoves(grid);
    const numMoves = validMoves.length;
    const randomInt = Math.floor(Math.random() * numMoves);
    return validMoves[randomInt];
  
  }

  static getWinningMoves(grid, symbol) {
    let winningMove;
    const validMoves = this.getValidMoves(grid);

    //goes through each available move and
    validMoves.forEach(move => {
      grid[move.row][move.col] = symbol; //adds that move to the grid
      let result = TTT.checkWin(grid);  //checks if move will win
      grid[move.row][move.col] = ' ';  //removes the test move from grid
      if (result === symbol){
          winningMove = move; //sets the winning move if true
      }
    })

    return winningMove;
  }

  static getSmartMove(grid, symbol) {
    //checks for winning move first
    let nextMove = this.getWinningMoves(grid, symbol);
    if (nextMove) {
      return nextMove; 
    }

    //identifies opponents symbol
    let opponentSymbol;
    if (symbol === 'X'){
      opponentSymbol = 'O';
    } else {
      opponentSymbol = 'X';
    }

    //checks if opponnent has a winning move
    nextMove = this.getWinningMoves(grid, opponentSymbol);
    if(nextMove) {
      return nextMove;
    }

  }

}

module.exports = ComputerPlayer;
