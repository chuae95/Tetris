/*
Tetris Code
Logic: Create a grid of "0"s and use "1"s to indicate if a space is already filled.
1.Create the grid with a 10 * 20 layout and fill it with 0s by using a nested array
2.Create a single piece and begin by including functionalities such as moving the piece and dropping the piece per second
3.Create the boundaries for the bottom and sides
4.Create the logic to update the values of the 10x20 grid of "0"s using the x, y position and the piece configuration.
5.The grid should only be updated when the fix is deemed to be at the bottom or has labnded on a separate piece. This is when a second piece should be generated
6
5.If the values cannot be updated, then it means that either it has reached the end or there is already another piece in the grid array.
6.

 */

let body = document.querySelector("body");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let game_grid = [10,20]
let grid_array = [];
context.scale(40,40);
const pieces = "ILJOTSZ";
let score = document.querySelector(".score");
let points = 0;
let game = false;
let start = document.querySelector(".start");
let myMusic = document.getElementById("audio");
let line = document.querySelector("#line");
let startup = document.querySelector("#startup");
let abutton = document.querySelector(".start-screen-gameboy-a")
let music = false;
let gameOver = document.querySelector(".modal");
let easy = document.querySelector(".easy");
let hard = document.querySelector(".hard");
let welcome = document.querySelector(".welcome");
let restart = document.querySelectorAll(".yes");
let storage = document.querySelector("#storage");
let gameOverMusic = document.querySelector("#gameOverMusic");
let context2 = storage.getContext("2d");
let spare = [];
let temp = [];
let a = 0;
let b = 10;

function gridSweep() {
    outer: for (let y = grid_array.length - 1; y > 0 ; y--) {
        for (let x = 0; x < grid_array[y].length; x++) {
            if (grid_array[y][x] === 0) {
                continue outer;
            }
        }
        line.play();
        const row = grid_array.splice(y, 1)[0].fill(0);
        grid_array.unshift(row);
        y++;
        a++
        if (a >  b) {
            interval -= 500;
            b += 5;
        }
        points += 50;
        score.textContent = "";
        score.textContent = points.toString();
    }
}

function collide(grid_array, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length ;x++) {
            if (m[y][x] !== 0 && (grid_array[y + o.y] && grid_array[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createPiece(type) {
    if (type == "T") {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
    } else if (type == "O") {
        return [
            [2,2],
            [2,2]
        ];
    } else if (type == "L") {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ];
    } else if (type == "J") {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ];
    } else if (type == "I") {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ];
    } else if (type == "S") {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0]
        ];
    } else if (type == "Z") {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ];
    }
}

for (let r = 0; r < game_grid[1]; r++) {
    grid_array.push([]);
    for (let c = 0; c < game_grid[0]; c++) {
        grid_array[r].push(0);
    }
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                grid_array[y + player.pos.y][x + player.pos.x] = value; //this will update the values in the array we created above.
            }
        })
    })

}


function drawMatrix(matrix, offset) { //offset will keep track of how much the pieces have been moved
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        })
    });
}

let lastTime = 0;
let timeLapse = 0;
let interval = 0;
const colors = [null, "red", "blue", "green", "yellow", "purple", "orange", "brown"];

function update(time = 0) {
    const timeDiff = time - lastTime;
    lastTime = time;
    timeLapse += timeDiff;
    if (timeLapse > interval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function playerMove(dir) { //this prevent the grid from exiting on the right/left or intersects with other pieces
    player.pos.x += dir;
    if (collide(grid_array, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {

    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = Math.floor(grid_array[0].length/2) - Math.floor(player.matrix[0].length / 2);
    if (collide(grid_array, player)) { //this is the condition that checks if there is a collision with the top of the map
        grid_array.forEach(row => row.fill(0));
        game = false;
        gameOver.style.display = "flex";
        myMusic.pause();
        gameOverMusic.play();
        music = false;
        player.swap = false;
    }
}

const player = {
    pos: {x:4, y: 0},
    matrix: createPiece(pieces[Math.floor(Math.random() * pieces.length)]),
    swap: false
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ]
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(grid_array, player)) {
        player.pos.x += offset; //check to the right
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}


document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        playerMove(-1);
    } else if (event.key === "ArrowRight") {
        playerMove(1);
    } else if (event.key === "ArrowDown") {
        playerDrop();
    } else if (event.key === "q") {
        playerRotate(-1);
    } else if (event.key === "e") {
        playerRotate(1);
    } else if (event.key === " ") {
        dropMax();
    } else if (event.key === "w") {
        swap();
    }
})

function dropMax() {
    if (game == true && interval > 0) {
        while (collide(grid_array, player) != true) {
            player.pos.y += 1;
        }
        player.pos.y -= 1;
        merge(grid_array, player);
        player.swap = false;
        playerReset(); //creates a new piece
        gridSweep();
        timeLapse = 0;
    }
}


function draw() {
    if (game == true && interval > 0) {
        context.fillStyle = "black"; //will "reset" the canvas
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(grid_array, {x: 0, y: 0})
        drawMatrix(player.matrix, player.pos); //this will call the function
    }
}

function playerDrop() { //this function means that when the piece moves 1 grid down, the timer is reset
    if (game == true && interval > 0) {
        player.pos.y += 1;
        if (collide(grid_array, player)) {
            player.pos.y -= 1;
            merge(grid_array, player);
            playerReset(); //creates a new piece
            gridSweep();
            player.swap = false;
        }
        timeLapse = 0;
    }
};

easy.addEventListener("click", function(){
    interval = 1000;
    welcome.textContent = "Welcome and Enjoy! Select a difficulty level to begin";
})

hard.addEventListener("click", function() {
    interval = 500;
    welcome.textContent = "Welcome and Enjoy! Select a difficulty level to begin";
})

start.addEventListener("click", function() {
    if (game == false && interval > 0) {
        start.textContent = "Click here to mute the music"
        game = true;
        draw();
        generateSpare();
        update();
        if (music == false) {
            myMusic.play();
            music = true;
        } else {
            myMusic.pause();
            music = false;
        }
    } else {
        welcome.textContent = "Seriously? Select a difficulty level! Then click play again!"
    }

})

restart.forEach((button) => {
    button.addEventListener("click", function() {
        interval = 0;
        gameOver.style.display = "none";
        context.fillStyle = "black";
        context.fillRect(0,0,game_grid[0],game_grid[1])
        context2.fillStyle = "black";
        context2.fillRect(0, 0, storage.width, storage.height);
        start.textContent = "Start the game!"
    })
})

context2.scale(30,30);
context2.fillStyle = "black";
context2.fillRect(0,0,storage.width,storage.height);

function generateSpare() {
    spare = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    spare.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context2.fillStyle = colors[value];
                context2.fillRect(x, y, 1, 1);
            }
        })
    })
}



function swap() {
    if (player.swap == false) {
        player.swap = true;
        context2.fillStyle = "black";
        context2.fillRect(0, 0, storage.width, storage.height);
        temp = player.matrix;
        player.matrix = spare;
        spare = temp;
        temp = [];
        player.pos.x = Math.floor(grid_array[0].length / 2) - Math.floor(player.matrix[0].length / 2);
        player.pos.y = 0;
        spare.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context2.fillStyle = colors[value];
                    context2.fillRect(x, y, 1, 1);
                }
            })
        })
    }
}

function showScreen() {
    gamestart.style.display = "none";
}

let gamestart = document.querySelector(".start-screen");
let startscreen = document.querySelector(".start-screen-gameboy-screen-animation")
abutton.addEventListener("click", function() {
    startscreen.style.backgroundSize = "cover";
    startscreen.style.backgroundImage = 'url("media/gameboy-start.gif")';
    startup.play();
    var mygame = setTimeout(showScreen, 2000);
    body.style.cursor = "crosshair";
})

let description = document.querySelector(".guide-description");
let up = document.querySelector(".guide-panel-direction-up");
let down = document.querySelector(".guide-panel-direction-down");
let left = document.querySelector(".guide-panel-direction-left");
let right = document.querySelector(".guide-panel-direction-right");
let rotateleft = document.querySelector(".guide-panel-actions-rotateleft");
let swapmove = document.querySelector(".guide-panel-actions-swap")
let rotateright = document.querySelector(".guide-panel-actions-rotateright");
let dropmax = document.querySelector(".guide-panel-actions-dropmax")

up.addEventListener("mouseover", function() {
    description.textContent = "This doesn't do anything.";
})

down.addEventListener("mouseover", function() {
    description.textContent = "This moves the piece down by 1 block.";
})

left.addEventListener("mouseover", function() {
    description.textContent = "This moves the piece left by 1 block.";
})

right.addEventListener("mouseover", function() {
    description.textContent = "This moves the piece right by 1 block.";
})

dropmax.addEventListener("mouseover", function() {
    description.textContent = "This drops the piece to the end and starts the next piece.";
})

swapmove.addEventListener("mouseover", function() {
    description.textContent = "This swaps the piece and stores it in the 'Stored Box' You will be able to swap each piece once.";
})

rotateleft.addEventListener("mouseover", function() {
    description.textContent = "This rotates the piece left once.";
})

rotateright.addEventListener("mouseover", function() {
    description.textContent = "This rotates the piece right once.";
})

