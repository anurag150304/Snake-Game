console.log("Snake Game");

const bgAudio = new Audio('Music/music.mp3');
const moveAudio = new Audio('Music/move.mp3');
const foodAudio = new Audio('Music/food.mp3');
const gameoverAudio = new Audio('Music/gameover.mp3');
const board = document.querySelector('.board');
const Tscore = document.querySelector('.score');
const scoreList = document.querySelector('ul');

let direction = { x: 0, y: 0 };
let lastPaintTime = 0;
const speed = 10;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }];
let foodDir = { x: 7, y: 8 };
const scoreArr = JSON.parse(localStorage.getItem('snakeGameScores')) || [];
let started = false;

// Main game loop
function main(currTime) {
    window.requestAnimationFrame(main);
    if ((currTime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = currTime;
    gameEngine();
}

// Check for collisions with walls or self
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].y >= 18 || snake[0].x <= 0 || snake[0].y <= 0) return true;
    return false;
}

// Update and save scores to localStorage
function scoreUpdate() {
    if (scoreArr.includes(score) || score == 0 || score < 10) {
        return;
    }
    scoreArr.push(score);
    scoreArr.sort((a, b) => b - a);
    localStorage.setItem('snakeGameScores', JSON.stringify(scoreArr));
    renderScores();
}

// Render the score list on the UI
function renderScores() {
    scoreList.innerHTML = "";
    scoreArr.forEach(val => {
        const listItem = document.createElement('li');
        listItem.innerText = `${val}`;
        scoreList.appendChild(listItem);
    });
}

// Core game logic
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameoverAudio.play();
        bgAudio.pause();
        alert("Game Over");
        scoreUpdate();
        resetGame();
        return;
    }

    if (snakeArr[0].y === foodDir.y && snakeArr[0].x === foodDir.x) {
        foodAudio.play();
        score++;
        Tscore.innerText = `Score : ${score}`;
        snakeArr.unshift({ x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y });
        foodDir = generateFoodPosition();
    }

    moveSnake();
    renderSnake();
    renderFood();
}

// Generate a random position for the food
function generateFoodPosition() {
    return { x: Math.floor(Math.random() * 16) + 1, y: Math.floor(Math.random() * 16) + 1 };
}

// Move the snake in the current direction
function moveSnake() {
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;
}

// Render the snake on the board
function renderSnake() {
    board.innerHTML = "";
    snakeArr.forEach((el, idx) => {
        const part = document.createElement('div');
        part.style.gridRowStart = el.y;
        part.style.gridColumnStart = el.x;
        part.classList.add(idx === 0 ? 'head' : 'snakeBody');
        board.appendChild(part);
    });
}

// Render the food on the board
function renderFood() {
    const food = document.createElement('div');
    food.style.gridRowStart = foodDir.y;
    food.style.gridColumnStart = foodDir.x;
    food.classList.add('food');
    board.appendChild(food);
}

// Reset the game state
function resetGame() {
    score = 0;
    direction = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    Tscore.innerText = `Score : ${score}`;
    bgAudio.currentTime = 0;
    bgAudio.play();
}

// Event listeners
document.addEventListener('keypress', (e) => {
    if (!(!started && e.key === 'Enter')) {
        return;
    }
    started = true;
    bgAudio.play();
    window.requestAnimationFrame(main);
    document.addEventListener('keypress', (e) => {
        moveAudio.play();
        switch (e.key) {
            case 'w':
                direction = { x: 0, y: -1 };
                break;
            case 's':
                direction = { x: 0, y: 1 };
                break;
            case 'a':
                direction = { x: -1, y: 0 };
                break;
            case 'd':
                direction = { x: 1, y: 0 };
                break;
            default:
                alert("Press a valid key to move");
                break;
        }
    });
});

// Load scores from localStorage on page load
window.onload = renderScores;