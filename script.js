document.addEventListener("DOMContentLoaded", () => {
  const cells = document.getElementsByClassName("board-cell");
  const status = document.getElementById("status");
  const resetButton = document.getElementById("reset");
  const resetScoresButton = document.getElementById("reset-scores");
  const changeNamesButton = document.getElementById("change-names");
  const player1NameElement = document.getElementById("player1-name");
  const player2NameElement = document.getElementById("player2-name");
  const player1ScoreElement = document.getElementById("player1-score");
  const player2ScoreElement = document.getElementById("player2-score");
  let currentPlayer = "X";
  let gameActive = true;
  let player1Name = "";
  let player2Name = "";
  let player1Score = 0;
  let player2Score = 0;

  // Verifica se existe nome de jogador no localStorage
  const getPlayerName = (playerNumber) => {
    const savedName = localStorage.getItem(`player${playerNumber}Name`);
    if (savedName) {
      return savedName;
    }
    return prompt(`Digite o nome do jogador ${playerNumber}`);
  };

  // Define os nomes dos jogadores
  player1Name = getPlayerName(1) == "" ? "player1" : getPlayerName(1);
  player2Name = getPlayerName(2) == "" ? "player2" : getPlayerName(2);

  // Atualiza os nomes dos jogadores na tela
  player1NameElement.textContent = player1Name;
  player2NameElement.textContent = player2Name;

  // Atualiza as pontuações dos jogadores na tela
  const updateScores = () => {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
  };

  // Carrega as pontuações dos jogadores do localStorage
  const loadScores = () => {
    const savedPlayer1Score = localStorage.getItem("player1Score");
    const savedPlayer2Score = localStorage.getItem("player2Score");

    player1Score = savedPlayer1Score ? parseInt(savedPlayer1Score) : 0;
    player2Score = savedPlayer2Score ? parseInt(savedPlayer2Score) : 0;

    updateScores();
  };

  // Salva a pontuação dos jogadores no localStorage
  const saveScores = () => {
    localStorage.setItem("player1Score", player1Score);
    localStorage.setItem("player2Score", player2Score);
  };

  // Atualiza a pontuação dos jogadores
  const updateScore = () => {
    if (currentPlayer === "X") {
      player1Score += 1;
    } else {
      player2Score += 1;
    }
    saveScores();
    updateScores();
  };

  // Verifica se há um vencedor ou empate
  const checkWinner = () => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        cells[a].textContent &&
        cells[a].textContent === cells[b].textContent &&
        cells[a].textContent === cells[c].textContent
      ) {
        cells[a].classList.add("winner");
        cells[b].classList.add("winner");
        cells[c].classList.add("winner");
        gameActive = false;
        status.textContent = `${
          currentPlayer === "X" ? player1Name : player2Name
        } venceu!`;
        updateScore();
        return;
      }
    }

    let isBoardFull = true;
    for (let cell of cells) {
      if (cell.textContent === "") {
        isBoardFull = false;
        break;
      }
    }

    if (isBoardFull) {
      gameActive = false;
      status.textContent = "Empate!";
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
  };

  // Manipulador de clique nas células do tabuleiro
  const handleCellClick = (event) => {
    const cell = event.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (cell.textContent !== "" || !gameActive) {
      return;
    }

    cell.textContent = currentPlayer;
    checkWinner();
  };

  // Reinicia o jogo
  const restartGame = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameActive = true;
    status.textContent = "";

    for (let cell of cells) {
      cell.textContent = "";
      cell.classList.remove("winner");
    }
  };

  // Limpa as pontuações
  const resetScores = () => {
    player1Score = 0;
    player2Score = 0;
    saveScores();
    updateScores();
    restartGame();
  };

  // Altera os nomes dos jogadores
  const changeNames = () => {
    player1Name = getPlayerName(1);
    player2Name = getPlayerName(2);
    player1NameElement.textContent = player1Name;
    player2NameElement.textContent = player2Name;
    resetScores();
    restartGame();
  };

  // Manipulador de clique do botão de reset
  resetButton.addEventListener("click", restartGame);

  // Manipulador de clique do botão de limpar pontos
  resetScoresButton.addEventListener("click", resetScores);

  // Manipulador de clique do botão de mudar nomes
  changeNamesButton.addEventListener("click", changeNames);

  // Adiciona o manipulador de clique em cada célula do tabuleiro
  for (let cell of cells) {
    cell.addEventListener("click", handleCellClick);
  }

  // Inicializa o jogo
  loadScores();
});
