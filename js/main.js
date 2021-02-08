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

//Start by creating the game grid with black background
let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d'); //This is needed for implementing 2d animations
let game_grid = [10, 20];
let grid_array = [];
context.scale(canvas.width/10, canvas.height/20);
let pieceCount = 0;
let pieceGenerator = [
    [
        [1,1],
        [1,1]
    ]
]

let pieces = [{
    x: 0,
    y: 0,
    config: pieceGenerator[0],
    active: true,
    collide: 0
}]

//This set of variables are for the users' control
let dir = "";

//This set of variables deal with the dropping of pieces by a specified time interval
let timeInterval = 1000;
let lastTime = 0;
let timeCheck = 0;

//this create the grid for game
function drawGrid() {
    context.fillStyle = "black";
    context.fillRect(0,0, game_grid[0], game_grid[1]);
}
drawGrid();

//this creates the supporting array and will provide a way to check the logic
for (let y = 0; y < game_grid[1]; y++) {
    grid_array.push([]);
    for (let x = 0; x < game_grid[0]; x++) {
        grid_array[y].push(0);
    }
}

//Creating the first piece in the game

function draw() {
    context.fillStyle = "red";
    checkGrid();
    pieces.forEach((piece, i) => {
        piece.config.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value != 0) {
                    context.fillRect(x + pieces[i].x, y + pieces[i].y, 1, 1);
                }
            })
        })
    })
}

//Create the logic to move the piece on a one second interval;
function update(time = 0) {
    let timeLapse = time - lastTime;
    lastTime = time;
    timeCheck += timeLapse;
    checkCollide();
    if (timeCheck > timeInterval && pieces[pieceCount].active == true) {
        pieces[pieceCount].y += 1;
        checkMove();
        timeInterval += 1000;
    }
    drawGrid();
    draw();
    requestAnimationFrame(update);
}

//Create the listeners for keydown events
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 37) {
        dir = "left"
    } else if (e.keyCode == 39) {
        dir = "right"
    } else if (e.keyCode == 40) {
        dir = "down"
    }
    move();
})

function move() {
    if (dir == "left" && pieces[pieceCount].active == true) {
        pieces[pieceCount].x -= 1;
        //create an if logic here to test the arr matrix of false squares
    } else if (dir == "right" && pieces[pieceCount].active == true) {
        pieces[pieceCount].x += 1;
        pieces[pieceCount].config.forEach((rows, y) => {
            rows.forEach((value, x) => {
                if (value != 0) {
                    if (grid_array[y + pieces[pieceCount].y][x + pieces[pieceCount].x] != 0) {
                        pieces[pieceCount].x -= 1;
                    }
                }
            })
        })
    } else if (dir == "down" && pieces[pieceCount].active == true) {
        pieces[pieceCount].y += 1;
    }
    checkMove();
    draw();
}

function checkMove() {
    if (pieces[pieceCount].y + pieces[pieceCount].config.length > 20) {
        pieces[pieceCount].active = false;
        pieces[pieceCount].y -= 1;
        generateNewPiece();
        updateGrid();
    }
    if (pieces[pieceCount].x - pieces[pieceCount].config[0].length < -pieces[pieceCount].config[0].length) {
        pieces[pieceCount].x += 1;
    }
    if (pieces[pieceCount].x + pieces[pieceCount].config[0].length > 10) {
        pieces[pieceCount].x -= 1;
    }

}

function generateNewPiece() {
    pieces.push({
        x: 0,
        y: 0,
        config: pieceGenerator[0],
        active: true,
        collide: 0
    })
    pieceCount += 1;
}

function updateGrid() {
    for (const piece of pieces) {
        if (piece.active == false && piece.y < 19) {
            piece.config.forEach((rows,y) => {
                rows.forEach((value, x) => {
                    if (value != 0) {
                        grid_array[y + piece.y][x + piece.x] = value;
                    }
                })
            })
        }
    }
}

function checkCollide() {
    pieces[pieceCount].config.forEach((rows, y) => {
        rows.forEach((value, x) => {
            if (value != 0) {
                if (grid_array[y + pieces[pieceCount].y][x + pieces[pieceCount].x] != 0) {
                    pieces[pieceCount].y -= 1;
                    pieces[pieceCount].collide += 1;
                    // if (dir == "down") {
                    //     pieces[pieceCount].y -= 1;
                    //     pieces[pieceCount].collide += 1;
                    // }
                    // if (dir == "left") {
                    //     pieces[pieceCount].x += 1;
                    // }
                    // if (dir == "right") {
                    //     pieces[pieceCount].x -= 1;
                    // }
                    if (pieces[pieceCount].collide > 2) {
                        pieces[pieceCount].active = false;
                        generateNewPiece();
                        updateGrid();
                    }
                }
            }
        })
    })
}

function checkGrid() {
    for (let a = 0; a < game_grid[1]; a++) {
        if (grid_array[a].indexOf(0) < 0) {
            console.log(a);
            grid_array.splice(a, 1);
            grid_array.unshift(new Array(10).fill(0));
            console.log(grid_array);

            for (const piece of pieces) {
                if (piece.y <= a) {
                    piece.y += 1;
                }
            }
        }
    }
}
let start = document.querySelector(".start");

start.addEventListener("click", function() {
    update()
});











