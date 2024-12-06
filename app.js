document.addEventListener("DOMContentLoaded", () => {
  const gameBtn = document.querySelector(".game-btn");
  const displayScore = document.getElementById("displayScore");
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const width = 10;
  let nextRandom = 0;
  let startingTime = 1500;
  let timerId;
  let gameOn = false;
  const colors = ["red", "green", "purple", "yellow", "orange"];

  // Tetrominos

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const allTetromino = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let startingPosition = 4;
  let startingRotation = 0;

  // console.log(allTetromino);
  // console.log(allTetromino[0]);
  // console.log(allTetromino[0][0]);

  // randomly select a Tetromino and its first rotation

  let random = Math.floor(Math.random() * allTetromino.length);
  let currentTetromino = allTetromino[random][startingRotation];

  function draw() {
    currentTetromino.forEach((index) => {
      // console.log(index);
      squares[startingPosition + index].classList.add("tetromino");
      squares[startingPosition + index].style.backgroundColor = colors[random];
    });
  }
  // draw();

  function unDraw() {
    currentTetromino.forEach((index) => {
      squares[startingPosition + index].classList.remove("tetromino");
      squares[startingPosition + index].style.backgroundColor = "";
    });
  }

  // setInterval(moveDown, 1000)

  // keyCode
  function control(e) {
    if (!gameOn) return;

    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keydown", control);

  function moveDown() {
    if (!gameOn) return;

    unDraw();
    startingPosition += width;
    draw();
    freeze();
  }

  // Freeze when tetromino hits end or other tetromino

  function freeze() {
    if (
      currentTetromino.some((index) =>
        squares[startingPosition + index + width].classList.contains("taken")
      )
    ) {
      currentTetromino.forEach((index) =>
        squares[startingPosition + index].classList.add("taken")
      );

      // new tetromino falling
      startingPosition = 4;
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * allTetromino.length);
      startingRotation = 0;
      currentTetromino = allTetromino[random][startingRotation];
      draw();
      displayShape();
      addScore(startingTime);
      gameOver();
    }
  }

  // move left or move right and rotate

  function moveLeft() {
    unDraw();

    const isAtLeftEdge = currentTetromino.some(
      (index) => (startingPosition + index) % width === 0
    );

    if (!isAtLeftEdge) {
      startingPosition -= 1;
    }

    if (
      currentTetromino.some((index) =>
        squares[startingPosition + index].classList.contains("taken")
      )
    ) {
      startingPosition += 1;
    }

    draw();
  }

  function moveRight() {
    unDraw();

    const isAtRightEdge = currentTetromino.some(
      (index) => (startingPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) {
      startingPosition += 1;
    }

    if (
      currentTetromino.some((index) =>
        squares[startingPosition + index].classList.contains("taken")
      )
    ) {
      startingPosition -= 1;
    }

    draw();
  }

  function rotate() {
    unDraw();
    startingRotation++;
    if (startingRotation === currentTetromino.length) {
      startingRotation = 0;
    }
    currentTetromino = allTetromino[random][startingRotation];
    draw();
  }

  // show next tetromino

  const nextSquares = document.querySelectorAll(".mini-grid div");
  const nextWidth = 4;
  const nextIndex = 0;

  const nextAllTetromino = [
    [1, nextWidth + 1, nextWidth * 2 + 1, 2], //lTetromino
    [0, nextWidth, nextWidth + 1, nextWidth * 2 + 1], //zTetromino
    [1, nextWidth, nextWidth + 1, nextWidth + 2], //tTetromino
    [0, 1, nextWidth, nextWidth + 1], //oTetromino
    [1, nextWidth + 1, nextWidth * 2 + 1, nextWidth * 3 + 1], //iTetromino
  ];

  function displayShape() {
    nextSquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    nextAllTetromino[nextRandom].forEach((index) => {
      nextSquares[nextIndex + index].classList.add("tetromino");
      nextSquares[nextIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // add functionality to the game button

  gameBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      gameOn = false;
    } else {
      draw();
      timerId = setInterval(moveDown, startingTime);
      nextRandom = Math.floor(Math.random() * allTetromino.length);
      displayShape();
      gameOn = true;
    }
  });

  // Change Time Function

  function changeTime(time) {
    if (timerId) clearInterval(timerId);

    let newTime = Math.max(time - 150, 300);
    timerId = setInterval(moveDown, newTime);
    startingTime = newTime;
  }

  // add score

  let score = 0;

  function addScore(time) {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        changeTime(time);
        score += 10;
        displayScore.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      currentTetromino.some((index) =>
        squares[startingPosition + index].classList.contains("taken")
      )
    ) {
      displayScore.innerHTML = `${alert("Game Over!")}`;
      score = 0;
      clearInterval(timerId);
      gameOn = false;
    }
  }
});
