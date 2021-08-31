ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

var escPressed = false;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var spacePressed = false;
var downPressed = false;
var genFlag = false;

var piece = null;
var board = null;
var gameStartFunc = null;

var score = 0;
var userId = "";
var clearedLines = 0;
var moveThisPiece = [];
var passedPath = [];
var arrivedPath = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == KEY.RIGHT) {
    rightPressed = true;
  } else if (e.keyCode == KEY.LEFT) {
    leftPressed = true;
  } else if (e.keyCode == KEY.DOWN) {
    downPressed = true;
  } else if (e.keyCode == KEY.UP) {
    upPressed = true;
  } else if (e.keyCode == KEY.ESC) {
    escPressed = true;
  } else if (e.keyCode == KEY.SPACE) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == KEY.RIGHT) {
    rightPressed = false;
  } else if (e.keyCode == KEY.LEFT) {
    leftPressed = false;
  } else if (e.keyCode == KEY.DOWN) {
    downPressed = false;
  } else if (e.keyCode == KEY.UP) {
    upPressed = false;
  } else if (e.keyCode == KEY.ESC) {
    //escPressed = false;
  } else if (e.keyCode == KEY.SPACE) {
    spacePressed = false;
  }
}

function move(piece) {
  clearCanvas(piece);
  draw(piece);
  pieceArrivalChk(piece);

  keyInsertChk(piece);
  isEnd(piece);
  if (collisionDetection(piece)) {
    console.log("blocked!", piece);
    genFlag = true;
  }
}

function clearLine() {
  var tmpGrid = Array.from(Array(ROWS), () => Array(COLS).fill(0));
  var sum, cnt, targetRow, row = 0;
  var rowInfo = [], piecePos = [];
  var count = 0;
  while (count != arrivedPath.length) { //길이가 0인거 제거
    count = 0;
    for (var i = 0; i < arrivedPath.length; i++) {
      if (arrivedPath[i].length == 0) {
        arrivedPath.splice(i, 1);
      } else {
        count++;
      }
    }
  }

  while (row <= endY) {
    sum = 0;
    cnt = 0;
    for (var i = 0; i < arrivedPath.length; i++) {
      for (var idx in arrivedPath[i]) {
        if (row == arrivedPath[i][idx].y) { //저장된 배열에 같은 행만
          sum += arrivedPath[i][idx].shapeNo; //행의 합
          cnt++; //행이 다찼는지 확인하는 용도
        }
      }
    }
    rowInfo.push({ pos: row, totalSum: sum, isFull: (cnt == 10) ? true : false });
    row++;
  }
  targetRow = -1;
  for (var idx in rowInfo) {
    if (rowInfo[idx].isFull) {
      targetRow = rowInfo[idx].pos; //다 찬 행의 인덱스를 저장
      break;
    }
  }
  if (targetRow >= 0) {
    console.log(arrivedPath);
    for (var i = 0; i <= endX; i++) {
      board.grid[targetRow][i] = 0; //다 찬행을 0으로 초기화
    }
    for (var i = 0; i < arrivedPath.length; i++) { //제거될 행으로 arrivedPath 동기화
      var notApplicableCnt = 0;
      while (notApplicableCnt != arrivedPath[i].length) {
        notApplicableCnt = 0;
        for (var q = 0; q < arrivedPath[i].length; q++) {
          if (arrivedPath[i][q].y == targetRow) {
            arrivedPath[i].splice(q, 1);
          } else {
            notApplicableCnt++;
          }
        }
      }
      for (var q = 0; q < arrivedPath[i].length; q++) {
        if (arrivedPath[i][q].y < targetRow) {
          arrivedPath[i][q].y++;
        }
      }
    }
    for (var c = 0; c < board.grid.length; c++) {
      for (var r = 0; r < board.grid[c].length; r++) {
        tmpGrid[c][r] = board.grid[c][r]; //깊은 복사
      }
    }
    for (var i = 0; i < targetRow; i++) {
      for (var q = 0; q <= endX; q++) {
        board.grid[i + 1][q] = tmpGrid[i][q]; //한칸씩 당기기
      }
    }
    piecePos = makePositionMap(piece)
    for (var idx in piecePos) { //영향받은 piece좌표 원상복구
      board.grid[piecePos[idx].y][piecePos[idx].x] = piecePos[idx].shapeNo;
    }
    for (var idx in rowInfo) {
      if (rowInfo[idx].isFull) {
        //console.log("earn score : ", rowInfo[idx].totalSum, " line cleared! ");
        clearedLines++;
        return rowInfo[idx].totalSum;
      }
    }
  } else {
    return 0;
  }
}

function isEnd() {
  for (var i = 0; i < arrivedPath.length; i++) {
    for (var q = 0; q < arrivedPath[i].length; q++) {
      if (arrivedPath[i][q].y <= 1) {
        return gameStopFunc(true);
      }
    }
  }
}

function pieceArrivalChk(piece) {
  if (piece.y + ylen(piece) > endY) {
    genFlag = true;
  }
}

function makePositionMap(piece) {
  var tmpArr = [];
  for (var c = 0; c < piece.shape.length; c++) {
    for (var r = 0; r < piece.shape[c].length; r++) {
      if (piece.shape[c][r] > 0) {
        tmpArr.push({ x: piece.x + r, y: piece.y + c, shapeNo: piece.shapeNo });
      }
    }
  }
  return tmpArr;
}

function collisionDetection(piece) {
  var posMap = makePositionMap(piece);
  for (var key in posMap) {
    for (var i = 0; i < arrivedPath.length; i++) {
      for (var q = 0; q < arrivedPath[i].length; q++) {
        if (posMap[key].x == arrivedPath[i][q].x) {
          if (posMap[key].y == arrivedPath[i][q].y) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function xCorrection(piece) { //축 보정 용도
  var distance = 0;
  var distances = [];
  for (var c = 0; c < piece.shape.length; c++) {
    for (var r = 0; piece.shape[c][r] == 0; r++) {
      distance++;
    }
    distances.push(distance);
    distance = 0;
  }
  return Math.min.apply(null, distances);
}

function refreshCanvas(piece) {
  clearCanvas(piece);
  draw(piece);
}

function keyInsertChk(piece) {
  if (piece.y + ylen(piece) <= endY) {
    piece.y += dy;
  }
  if (downPressed) {
    if (piece.y + ylen(piece) <= endY) { //y축 최대지점 도착전
      piece.y += dy;
    }
  }
  if (spacePressed) { //하드 드랍
    var y;
    for (y = endY; y > piece.y + ylen(piece); y--) {
      var cnt = 0;
      for (var x = piece.x; x < piece.x + xlen(piece); x++) {
        if (board.grid[y][x] == 0) {
          cnt++;
        }
      }
      if (cnt == xlen(piece)) {
        break;
      }
    }
    if (arrivedPath.length == 0) {
      piece.y = endY - ylen(piece) + 1;
    } else {
      var tmp = y;
      for (var tY = tmp; tY > piece.y + ylen(piece); tY--) {
        for (var x = piece.x; x < piece.x + xlen(piece); x++) {
          if (board.grid[tY][x] != 0) {
            y = tY - 1;
          }
        }
      }
      piece.y = y - ylen(piece);
      refreshCanvas(piece);
    }
  }
  if (piece.y != endY - ylen(piece) + 1) { //땅바닥에 안꽂힌 경우
    if (rightPressed) {
      if (piece.x + xlen(piece) + xCorrection(piece) <= endX) { //x축 최대범위 내
        piece.x += dx;
      }
    }
    if (leftPressed) {
      if (piece.x + xCorrection(piece) > 0) { //x축 최소범위 내
        piece.x -= dx;
      }
    }
  }
  if (upPressed) {
    if (piece.shapeNo != 4) { //4번은 회전할 필요가 없음 'ㅁ'
      rotateBlock(piece);
    }
  }

}

function btmPatternChk(piece) {
  var res = [];
  for (var c = 0; c < piece.shape.length; c++) {
    var tmpArr = [];
    for (var r = 0; r < piece.shape[c].length; r++) {
      tmpArr.push(piece.shape[c][r]);
    }
    var tmpSet = new Set(tmpArr);
    if (!(tmpSet.size == 1 && tmpSet.has(0))) {
      res.push(tmpArr);
    }
  }
  res = res[res.length - 1];
  return res;
}

function rotateBlock(piece) {
  //console.log("rotate block");
  var tmpPiece = piece;
  var tmpShape = Array.from(Array(piece.shape.length), () => Array(piece.shape.length).fill(0))

  for (var c = 0; c < piece.shape.length; c++) { //시계방향 90도 회전
    for (var r = 0; r < piece.shape[c].length; r++) {
      tmpShape[r][tmpShape.length - c - 1] = piece.shape[c][r];
    }
  }
  tmpPiece.shape = tmpShape;
  tmpPiece.status += 90;
  if (tmpPiece.status == 360) {
    tmpPiece.status = 0;
  }
  piece = tmpPiece;
}

function draw(piece) {
  var postX = 3;
  var postY = 0;
  for (var c = 0; c < piece.shape.length; c++) {
    for (var r = 0; r < piece.shape[c].length; r++) {
      if (piece.shape[c][r] > 0) { //공중에 있는 piece그리기
        piece.ctx.beginPath();
        piece.ctx.fillStyle = piece.color;
        var yPosition = piece.y + c;
        if (yPosition > endY) yPosition = endY;
        piece.ctx.rect(piece.x + r, yPosition, 1, 1);
        board.grid[yPosition][piece.x + r] = piece.shapeNo;
        passedPath.push({ x: piece.x + r, y: yPosition, color: piece.color, shape: piece.shape, shapeNo: piece.shapeNo, xlength: xlen(piece), ylength: ylen(piece) });

        piece.ctx.fill();
        piece.ctx.closePath();
      }
      postX = piece.x + r;
      postY = piece.y + c;
    }
  }
  //바둑판 모양 그리기
  ctx.strokeStyle = 'silver';
  ctx.lineWidth = 0.01;
  for (var c = 0; c <= endX; c++) {
    for (var r = 0; r <= endY; r++) {
      ctx.strokeRect(c, r, 1, 1);
    }
  }
}

function idSort() {
  var savedData = JSON.parse(localStorage.getItem("Rank"));
  savedData = savedData.sort(function (a, b) {
    let x = a.id.toLowerCase();
    let y = b.id.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  localStorage.setItem("Rank", JSON.stringify(savedData));
  window.location.reload();
}

function numSort() {
  var savedData = JSON.parse(localStorage.getItem("Rank"));
  savedData = savedData.sort(function (a, b) {
    return b.score - a.score;
  });
  localStorage.setItem("Rank", JSON.stringify(savedData));
  window.location.reload();
}

function clearCanvas(piece) {
  for (var key in passedPath) { // piece가 지나온 경로 제거
    board.grid[passedPath[key].y][passedPath[key].x] = 0;
  }
  piece.ctx.clearRect(0, 0, canvas.width, canvas.height);
  //캔버스 모두 지우기
  for (var c = 0; c < board.grid.length; c++) {
    for (var r = 0; r < board.grid[c].length; r++) {
      if (board.grid[c][r] > 0) { // board.grid에 있는 정보를 토대로 색칠
        piece.ctx.beginPath();
        piece.ctx.rect(r, c, 1, 1);
        piece.ctx.fillStyle = COLORS[board.grid[c][r]];
        piece.ctx.fill();
        piece.ctx.closePath();
      }
    }
  }
}

function initBoard() {
  var tmpBoard = new Board();
  tmpBoard.reset();
  return tmpBoard;
}

function savePath(passedPath) {
  //passedPath에 도착한 좌표만 저장하기 위한 용도
  var tmpArr = [];
  while (passedPath.length != 0) {
    if (passedPath.length > 4) {
      passedPath.shift(); //중간 경로 좌표 제거
    } else {
      tmpArr.push(passedPath.pop());
    }
  }
  arrivedPath.push(tmpArr.reverse());
}

function gameStopFunc(gameStop) {
  if (gameStop) {
    clearInterval(gameStartFunc);
    console.clear();
    console.log("game end");
    saveScore(gameStop);
  }
}

function saveScore() {
  if (localStorage.getItem("Rank") === null) {
    localStorage.setItem("Rank", JSON.stringify([]));
  } else {
    var savedData = JSON.parse(localStorage.getItem("Rank"));
    //console.log("가져옴 ", savedData);
    var save = true;
    for (var idx in savedData) {
      if (savedData[idx].id == userId) {
        if (savedData[idx].score < score) {
          savedData[idx].score = score;
          savedData[idx].clearedLines = clearLines;
          savedData[idx].level = Math.floor(score / 100);
          save = false;
          break;
        }
      }
    }
    if (save) {
      savedData.push({ id: userId, score: score, clearedLines: clearedLines, level: Math.floor(score / 100) });
    }
    savedData = savedData.sort(function (a, b) {
      return b.score - a.score;
    });
    localStorage.setItem("Rank", JSON.stringify(savedData));
    //console.log(savedData)
    //console.log("at local....", JSON.parse(localStorage.getItem("Rank")));
  }
}

function userInit() {
  var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var num = "0123456789";
  var randomizedName = "";
  for (var i = 0; i < Math.floor((Math.random() * 8) + 3); i++) {
    randomizedName += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  for (var i = 0; i < Math.floor((Math.random() * 4) + 2); i++) {
    randomizedName += num.charAt(Math.floor(Math.random() * num.length));
  }
  userId = prompt("insert your id", randomizedName);
  play();
}

function play() {
  // piece, board 전역 변수 해제 할 것.
  board = initBoard();
  piece = new Piece(ctx);
  var level = 0;
  var sec = 700;
  gameStartFunc = setInterval(function () {
    if (genFlag) {
      piece = new Piece(ctx);
      savePath(passedPath);
      score += clearLine();
      level = Math.floor(score / 100);
      sec -= level * 10;
      console.log("speed up! ", sec);
      document.getElementById("score").innerHTML = score;
      document.getElementById("lines").innerHTML = clearedLines;
      document.getElementById("level").innerHTML = level;
      genFlag = false;
    } else {
      if (!escPressed) {
        move(piece);
      }
    }
  }, 250);

}