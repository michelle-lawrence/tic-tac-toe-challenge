var gameCell = {
	set: false,
	val: ''
};
var game;
var player1;
var player2;

$(document).ready(function(){

	initiateGameState();

	$("#new-game").click(function(event){
		initiateGameState();
		$(".game-board div.col").css("background-image", "");
	});

	$(".game-board").on("click", "div.col", function(event){
		if (!game.gameWon) {
			var cell = $(this).closest("div.col"); 
			//use regular expression to pull digits from class names
			var colNum = cell.attr('class').match(/\d+/)[0];
			var rowNum = cell.parents().attr('class').match(/\d+/)[0];
			if (game.gameBoard[rowNum - 1][colNum - 1].set == false) {				
				if (game.turn % 2 == 0){
					cell.css("background-image", "url('images/X.png')");
					game.gameBoard[rowNum - 1][colNum - 1].val = "X";
					updatePlayerBoard(player1, rowNum, colNum);
					checkForWin(player1);
				} else {
					cell.css("background-image", "url('images/O.png')");
					game.gameBoard[rowNum - 1][colNum - 1].val = "O";
					updatePlayerBoard(player2, rowNum, colNum);
					checkForWin(player2);
				}
				game.gameBoard[rowNum - 1][colNum - 1].set = true;
				game.turn++;
			}	
		}		
	});

	$("#reset").click(function(event){
		$(".score-board table").html("<tr><td>Player 1</td><td>Player 2</td></tr>");
		player1.score = 0;
		player2.score = 0;
		$("#reset").css("display", "none");
	});
});

function Game(boardDimensions) {
	this.dimensions = boardDimensions;
	this.turn = 0;
	this.gameWon = false;
	this.gameBoard = [];
	//build square board object 
	$("#main-board").html(""); 
	for (var row = 0; row < boardDimensions; row++){
		$(".game-board").append("<section class='row row-" 
			+ (row + 1) + "'>");
		var rowArray = [];
		for (var col = 0; col < boardDimensions; col++){
			$(".row-" + (row + 1)).append("<div class='col col-" 
				+ (col + 1) + "'></div>");
			rowArray.push(Object.create(gameCell));
		}
		this.gameBoard.push(rowArray);
	}
};

function Player(gamePiece, score, board) {
	this.gamePiece = gamePiece;
	this.score = score;
	this.board = board;
};

function initiateGameState(){
	game = new Game(3);

	player1 = new Player('images/X.png',0,buildPlayerBoard());
	player2 = new Player('images/O.png',0,buildPlayerBoard());
};

function buildPlayerBoard() {
	var row = [], col = [];
	for (var i = 0; i < game.dimensions; i++){
		row.push(0);
		col.push(0);
	}
	var diagonal = [0,0];
	var board = new Array(row, col, diagonal);
	return board;
}
function updatePlayerBoard(playerX, row, col) {
	playerX.board[0][row - 1]++; //update row count
	playerX.board[1][col - 1]++; //update col count
	//Check for/update diagonal
	switch(row) {
		case "1":
			if (col == 1) {
				playerX.board[2][0]++;
			} else if (col == 3) {
				playerX.board[2][1]++;
			}
			break;
		case "2":
			if (col == 2) {
				playerX.board[2][0]++;
				playerX.board[2][1]++;
			}
			break;
		case "3":
			if (col == 1) {
				playerX.board[2][1]++;
			} else if (col == 3) {
				playerX.board[2][0]++;
			}
			break;
		default:
			break;
	}
};

function checkForWin(playerX){
loop1:
	for (var i = 0; i < playerX.board.length; i++) {
loop2:
		for (var j = 0; j < playerX.board[i].length; j++){
			if (playerX.board[i][j] == game.dimensions) {
				game.gameWon = true;
				break loop1;
			}
		}
	}
	if (game.gameWon) {
		//Win state
		playerX.score++;
		updateScoreBoard();
	} else if (game.turn >= (Math.pow(game.dimensions, 2) - 1)) {
		//Tie state
		updateScoreBoard();
	}
};

function updateScoreBoard() {
	if(player1.score > player2.score){
		$(".score-board table").append("<tr><td><img src='" 
			+ player1.gamePiece + "' /></td><td></td></tr>");
		$("#reset").css("display", "inline");
	}
	else if (player2.score > player1.score) {
		$(".score-board table").append("<tr><td></td><td><img src='" 
			+ player2.gamePiece + "' /></td></tr>");
		$("#reset").css("display", "inline");
	}
	else { //tie
		$(".score-board table").append("<tr><td>Tie</td><td>Tie</td></tr>");
		$("#reset").css("display", "inline");
	}
}



