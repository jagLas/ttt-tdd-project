const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require("./computer-player");

class TTT {

  constructor() {

    this.playerTurn = "O";
    this.cpu;

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);
    Screen.setBackgroundColor(this.cursor.row, this.cursor.col, this.cursor.cursorColor);

    // Section for commands
    Screen.addCommand('up', 'move cursor up', TTT.upCommand.bind(this));
    Screen.addCommand('down', 'move cursor down', TTT.downCommand.bind(this));
    Screen.addCommand('left', 'move cursor left', TTT.leftCommand.bind(this));
    Screen.addCommand('right', 'move cursor right', TTT.rightCommand.bind(this));
    Screen.addCommand('space', 'place an X or an O', TTT.placeMove.bind(this));
    Screen.addCommand('x', 'press x have cpu play X', TTT.addComputer.bind(this, 'X'));
    Screen.addCommand('o', 'press o have cpu play O', TTT.addComputer.bind(this, 'O'));

    //render screen to begin
    Screen.setMessage(`It is Player ${this.playerTurn}'s turn\nPress 'space' to make a move and play two-player\nPress 'x' to have the computer play x's\nPress 'o' to have the computer play O's`);
    Screen.render();
  }

  static addComputer(symbol) {
    this.cpu = new ComputerPlayer(symbol);
   
    if (this.cpu.symbol === 'O') {
      this.cpuMove();
      Screen.setMessage(`Computer was set to ${symbol} and made it's first move.\nIt is your turn:\nPress 'space' to place your move.`)

    } else {
      Screen.setMessage(`Computer was set to ${symbol}.\nIt is your turn:\nPress 'space' to place your move.`)
    }
    Screen.render();
  }

  cpuMove() {
    let move = ComputerPlayer.getSmartMove(Screen.grid, this.cpu.symbol);
    Screen.setGrid(move.row, move.col, this.playerTurn)
    Screen.render();

    this.changeTurn();
    Screen.setMessage(`It is Player ${this.playerTurn}'s turn`);
    Screen.render();

    let winner = TTT.checkWin(Screen.grid);
    if(winner){
      TTT.endGame(winner);
    }
  }

  static upCommand() {
    this.cursor.up();
    Screen.render();
  }

  static downCommand() {
    this.cursor.down();
    Screen.render();
  }

  static leftCommand() {
    this.cursor.left();
    Screen.render();
  }

  static rightCommand() {
    this.cursor.right();
    Screen.render();
  }

  changeTurn(){
    if (this.playerTurn === 'O') {
      this.playerTurn = 'X';
    } else {
      this.playerTurn = 'O';
    }
  }

  static placeMove() {
    //set the grid to display move and render screen
    Screen.setGrid(this.cursor.row, this.cursor.col, this.playerTurn);
    Screen.render();
    
    this.changeTurn();



    // if (this.cpu.symbol === this.playerTurn) {
    //   ComputerPlayer.cpuMove(this.cpu.symbol);
    //   if (this.playerTurn === 'O') {
    //     this.playerTurn = 'X';
    //   } else {
    //     this.playerTurn = 'O';
    //   }
    // }
    Screen.setMessage(`It is Player ${this.playerTurn}'s turn`);
    Screen.render();

    //checks if there is a winner
    let winner = TTT.checkWin(Screen.grid);
    if(winner){
      TTT.endGame(winner);
    }

    if (this.cpu) {
      this.cpuMove(this.cpu.symbol)
    }


  }

  static checkWin(grid) {
    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

    //checks an array to see if all are of one mark
    function checkRow(row) {

      let xMarks = row.filter(square => {
        return square.toLowerCase() === 'x'
      })

      let oMarks = row.filter(square => {
        return square.toLowerCase() === 'o'
      })

      if (xMarks.length === grid.length) {
        return 'X';
      } else if (oMarks.length === grid.length) {
        return 'O';
      }
    }

    //checks each row for wins. Can be used with modified arrays to check vertical and diagnols
    function checkAllRows(grid) {
      for (let i = 0; i < grid.length; i++) {
        let winner = checkRow(grid[i]);
        if (winner === 'X' || winner ==='O'){
          return winner;
        };
      }
    }

    //take the grid and makes each column into rows by reflecting over main diagonal
    function turnColsToRows (grid) {
      let cols = [];
      let length = grid.length;

      for (let col = 0; col < length; col ++) {
        let column = [];

        for (let row = 0; row < length; row++) {
          column.push(grid[row][col]);
        }

        cols.push(column);
      }

      return cols;
    }

    //makes a 2D array of the diagnols
    function makeDiagnols (grid) {
      let diagonals = [];
      let length = grid.length;

      let diagonal = [];
      for (let col = 0, row = 0; col < length; col++, row++) {
        diagonal.push(grid[row][col]);
      }
      diagonals.push(diagonal);

      diagonal = [];
      for (let col = 0, row = length - 1; col < length; col++, row--) {
        diagonal.push(grid[row][col]);
      }
      diagonals.push(diagonal);

      return diagonals;
    }

    //checks for Ties
    function checkTies(grid) {
      //finds if there is an empty square and returns false if there is one and true if there isn't
      for (let row = 0; row < grid.length; row++){
        for (let col = 0; col < grid.length; col++){
          let square = grid[row][col];
          if (square === ' ') {
            return false;
          }
        }
      }
      return true;
    }


    let winner = (() => {

      if (checkAllRows(grid)){  //checks rows
        return checkAllRows(grid);
      } else if (checkAllRows(turnColsToRows(grid))) {  //checks columns
        return checkAllRows(turnColsToRows(grid));
      } else if (checkAllRows(makeDiagnols(grid))) {  //checks diaganols
        return checkAllRows(makeDiagnols(grid)); 
      } else if (checkTies(grid)){  //checks ties
        return 'T';
      } else {
        return false; //returns false if none of those
      }
    })()

    return winner;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;