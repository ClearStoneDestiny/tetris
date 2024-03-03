// Locals

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const totalScore = document.getElementById('score');
const pausePage = document.getElementById('pause');
const gameOverScreen = document.querySelector('.overlay');
const buttonRestart = document.querySelector('.button-restart');
const buttonNewGame = document.querySelector('.button-new-game');
const winningScreen = document.querySelector('.win-screen');
const maxLevel = 3;
const buttonLeft = document.getElementById('arrow-left');
const buttonRight = document.getElementById('arrow-right');
const buttonUp = document.getElementById('arrow-up');
const buttonDown = document.getElementById('arrow-down');


let playfield;
let tetromino;
let timedId;
let score = 0;
let isPaused = false;
let isGameOver = false;
let isWin = false;
let cells;
let level = 1;
let nextLevel = 100;
let seconds = 0;
let minutes = 0;
// const timerElement = setInterval(startTime, 1000);
 



const TETROMINO_NAMES = [
    'O',
    'J',
    'L',
    'I',
    'S',
    'T',
    'Z'
]

const TETROMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}

init();





function init(){
    timeCount = true;
    isGameOver = false;
    generatePlayField();
    generateTetromino();
    cells = document.querySelectorAll('.grid div');
    moveDown();
    
    
    totalScore.innerHTML = 0;
    document.getElementById('nextLevelScore').textContent = nextLevel;
    document.getElementById('currentLevel').textContent = level;
    timerElement = setInterval(startTime, 1000)
    // startTime();
}

    buttonRestart.addEventListener('click', function(){
        document.querySelector('.grid').innerHTML = '';
        gameOverScreen.style.display = 'none';
        init();
        
    })

    buttonNewGame.addEventListener('click', function(){
        document.querySelector('.grid').innerHTML = '';
        stopTime();
        init();
    })

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}


// Timer

function formatTime(time){
    return time < 10 ? `0${time}` : time;
}

function startTime(){
            seconds++;
            if(seconds === 60){
                minutes++;
                seconds = 0;
            }
            if(minutes === 60){
                minutes = 0;
            }
    document.getElementById('time').innerHTML = `${formatTime(minutes)}:${formatTime(seconds)}`;
           
}

function stopTime() {
    clearInterval(timerElement);  
    seconds = 0;
    minutes = 0;
    
}


// Count score

function countScore(destroyRows){
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2:
            score += 20;
                break;
        case 3:
            score += 35;
                break;
        case 4:
            score += 50;
                break;
    }

    if(destroyRows > 0){
        totalScore.innerHTML = score;
    }

    if(nextLevel < 0){
        nextLevel = 0;
    }

    if (score >= 100 && level === 1) {
        level = 2;
        nextLevel = 200;
        document.getElementById('nextLevelScore').textContent = nextLevel; // Update needed score
        document.getElementById('currentLevel').textContent = level;
    } else if (score >= 200 && level === 2) {
        level = 3;
        nextLevel = 300;
        document.getElementById('nextLevelScore').textContent = nextLevel; // Update needed score for next level
        document.getElementById('currentLevel').textContent = level;
    }else if (score >= 300 && level === 3) {
        winScreen();
    }
    
    if (level > currentLevel) {
        init();
        currentLevel = level;
     // Update current level
    }
    

}

// Win Screen

function winScreen(){
    winningScreen.style.display = 'flex';
    stopMoveDown();
    
}

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    console.table(playfield);
}

function generateTetromino(){

    const name   = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -2;

    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column
    }
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(isOutsideOfTopBoard(row)){
                isGameOver = true;
                return;
            }

            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }

    const filledRows = findFilledRows();
    deleteRows(filledRows);
    generateTetromino();
    countScore(filledRows.length)

}



function deleteRows(filledRows){
    for(let i = 0; i < filledRows.length; i++){
        const row = filledRows[i];
        dropRows(row);
    }
}

function dropRows(removeRow){
    for(let row = removeRow; row > 0; row--){
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows(){
    const filledRows = [];

    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] != 0){
                filledColumns++; 
            }
        }
        if(PLAYFIELD_COLUMNS === filledColumns){
            filledRows.push(row);
        }
    }

    return filledRows;
}

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(isOutsideOfTopBoard(row)) continue;
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}


function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}


draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e){

    if(e.key == 'Escape'){
        togglePauseGame();
    }
    if(!isPaused){
        switch(e.key){
            case ' ':
                dropTetrominoDown();
                break;
            case 'ArrowUp':
                rotate();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
        } 
    }
    
    draw();
}

// document.addEventListener('mousedown', onClickButton);

// function onClickButton(e){
//     console.log('Button clicked');
//     if(isPaused === false){
//         switch(e.target.id){
//             case 'arrow-up':
//                 rotate();
//                 break;
//             case 'arrow-right':
//                 moveTetrominoRight();
//                 break;
//             case 'arrow-left':
//                 moveTetrominoLeft();
//                 break;
//             case 'arrow-down':
//                 moveTetrominoDown();
//                 break; 
//             default:
//                 break;   
//         } 
//     }
    
//     draw();
// }

buttonLeft.addEventListener('click', moveTetrominoLeft);
buttonRight.addEventListener('click', moveTetrominoRight);
buttonUp.addEventListener('click', rotate);
buttonDown.addEventListener('click', moveTetrominoDown);

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }

    return rotateMatrix;
}

function moveTetrominoDown(){
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
}

function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}

function moveTetrominoRight(){
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}

function dropTetrominoDown(){
    while(isValid()){
        tetromino.row++;
    }
    tetromino.row--;
}


// Game Over

function gameOver(){
    stopMoveDown();
    gameOverScreen.style.display = 'flex';
}


// Move down automatic

function moveDown(){
    moveTetrominoDown();
    draw();
    stopMoveDown();
    startMoveDown();
    if(isGameOver){
        gameOver();
        stopTime();
    }
}

moveDown();

function startMoveDown(){
    timedId = setTimeout(() =>{
        requestAnimationFrame(moveDown)
    }, 1000)
}

function stopMoveDown(){
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);

    timedId = null;
}

// Pause

function gameOnPause(){
    const pausedGame = document.getElementById('pause-sound');
    pausedGame.volume = 0.2 
    pausedGame.play();
}

function togglePauseGame(){
    if(isPaused === false){
        pausePage.style.display = 'flex';
        stopMoveDown();
        gameOnPause();
    } else{
        startMoveDown();
        gameOnPause();
        pausePage.style.display = 'none';
    }
    isPaused = !isPaused;
}

function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(isOutsideOfGameboard(row, column)) { return false; }
            if(hasCollisions(row, column)) { return false; }
        }
    }

    return true;
}

function isOutsideOfTopBoard(row){
    return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column){
    return tetromino.matrix[row][column] && 
    (
        tetromino.column + column < 0 
        || tetromino.column + column >= PLAYFIELD_COLUMNS
        || tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] 
    && playfield[tetromino.row + row]?.[tetromino.column + column];
}