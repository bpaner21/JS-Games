/* Notes:
Block colors:
rgb
Line: Cyan '00FFFF'
F: Blue '0000FF'
L: Orange 'FFAA00'
Square: Yellow 'FFFF00'
S: Green '00FF00'
T: Purple 'FF00FF'
Z: Red 'FF00FF'
*/


// Variables
const Orange = '#FFAA00';
const Red = '#FF0000';
const Green = '#00FF00';
const Blue = '#0000FF';
const Yellow = '#FFFF00';
const Magenta = '#FF00FF';
const Cyan = '#00FFFF';
const Black = '#000000';

// Debug switch
let debug = false;

let pause = false;

// Reference HTML file
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
context.linewidth = 1;
//context.fillStyle = '#AAAAAA';
//context.fillRect(0,0, context.canvas.width, context.canvas.height);

// The side length of a square in pixels
// Not constant so the app can scale to screen size
let size = (window.innerHeight/23);
let sizePointOne = (size * 0.15);
let sizePointTwo = (size * 0.3);
let sizeFill = size - sizePointTwo;

let random = 0;

// let numColumn = (debug) ? (Math.floor(window.innerWidth / size) - 2) : 10;
let numColumn = 10;
let numRow = 22;

// The distance from the screen edge in pixels
let offset = size * 2;

/*
Use the SRS system to create roation
add bounding box field to Piece class data (Change Piece to class first)
line = 4 bounding
square = 2 bounding
other five pieces = 3 bounding
*/

// The basic square that defines the grid, tetris blocks
const Square = class{

    constructor(fill, color, x, y){
        this.fill = fill;
        this.color = color;
        this.x = x;
        this.y = y;
        this.centerX = x + 0.5;
        this.centerY = y + 0.5;
    }

    copy(copy) {
        this.fill = copy.fill;
        this.color = copy.color;
        this.x = copy.x;
        this.y = copy.y;
        this.centerX = copy.x + 0.5;
        this.centerY = copy.y + 0.5;
    }
}

let Grid = [];

window.addEventListener('keyup', function(event) {
    switch(event.keyCode) {
        case 32: // Space key
            debug = !debug;
            //numColumn = (debug) ? (Math.floor(window.innerWidth / size) - 2) : 10;
            //CreateGrid();
            Redraw();
            break;
        case 38: // Up

            break;
        case 81: // 'Q' key
            pause = !pause;
            console.log("pause = " + pause);
            if (!pause) { requestAnimationFrame(Render); }
            break;
    }
});

window.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
        case 37: //
            if (Piece[3].x > 0) {
                PieceX(-1);
            }
            break;
        case 39: // Right
            if (Piece[3].x < 9) {
                PieceX(1);
            }
            break;
        case 40: // down
            RotatePiece();
            break;
    }
});

// Setup
let Resize = function() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    // if window is taller than it is wide
    // crap version
    // change condition so it only resizes when the window width is less than the app width
    /*if (window.innerHeight >= window.innerWidth && window.innerWidth < (size * 14)) {
        size = window.innerWidth / 14;
    }
    else {
        size = window.innerHeight / 23;
    }*/

    size = (window.innerHeight >= window.innerWidth && window.innerWidth < (size * 14)) ? (window.innerWidth / 14) : (window.innerHeight / 23);

    sizePointOne = (size * 0.15);
    sizePointTwo = (size * 0.3);
    sizeFill = size - sizePointTwo;

    /* if (debug) {
        numColumn = Math.floor(window.innerWidth / size) - 2;
    } //*/

    // The distance from the screen edge in pixels
    offset = size * 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let x = 0; x < numColumn; ++x){
        for (let y = 0; y < numRow; ++y){
            Grid[x][y].x = x; // offset + (x * size);
            Grid[x][y].y = y; // (y * size);
        }
    }

    DrawGrid();
}

window.addEventListener('resize', Resize);

let CreateGrid = function() {
    // Create the playing grid
    for (let x = 0; x < numColumn; ++x){
        Grid[x] = [];
        for (let y = 0; y < numRow; ++y){
            Grid[x][y] = new Square(false, "#FF00FF", x, y);
        }
    }
}

// Piece functions
let Piece = [];

let CreatePiece = function() {
    for (let x = 0; x < 4; ++x) {
        Piece[x] = new Square();
        Piece[x].copy(Grid[5][2 + x]);
        Piece[x].color = Orange;
    }
}
context.font = '10pt Helvetica';

let DrawPiece = function() {

    for (let x = 0; x < 4; ++x) {
        context.fillStyle = Piece[0].color;
        context.fillRect(offset + (Piece[x].x * size) + sizePointOne, (Piece[x].y * size) + sizePointOne, sizeFill, sizeFill);

        context.fillStyle = Black;
        context.fillText(x, offset + (Piece[x].x * size) + sizePointOne, (Piece[x].y * size) + sizePointOne);
    }
    context.strokeStyle = Blue;
    context.beginPath();
    context.arc(offset + ((Piece[2].x) * size), (Piece[2].y * size), size, 0, 2 * Math.PI);
    context.stroke();
}

let DropPiece = function() {

    if (Piece[3].y < 21) {
        for (let x = 0; x < 4; ++x) {
            ++Piece[x].y;
        }
    }
}

let PieceX = function(xChange) {
    for (let x = 0; x < 4; ++x) {
        Piece[x].x += xChange;
    }
}

const sinTheta = Math.sin(Math.PI/2);
const costTheta = Math.cos(Math.PI/2);

// As this function is now, it applies the SRS to 5 of the seven pieces
// A check can be added so that the square piece doesn't rotate
// The problem is that this algroithm cannot properly rotate the line piece
// A secondary algorithm is going to need to be added to accomodate that

let RotatePiece = function() {
    let px = Piece[2].x;
    let py = Piece[2].y;

    for (let i = 0; i < 4; ++i) {

        console.debug("1. [" + i + "]: " + Piece[i].x + ", " + Piece[i].y);

        let a = Piece[i].x - px;
        let b = Piece[i].y - py;

        console.debug("2. [" + i + "]: " + Piece[i].x + ", " + Piece[i].y);

        Piece[i].x = px + (a * costTheta) - (b * sinTheta);
        Piece[i].y = py + (a * sinTheta) + (b * costTheta);

        console.debug("3. [" + i + "]: " + Piece[i].x + ", " + Piece[i].y);

    }


}

// Draw functions

let DrawGrid = function() {
    context.fillStyle = '#CCCCCC';
    context.fillRect(0,0, context.canvas.width, context.canvas.height);

    context.strokeStyle = Black;
    for (let x = 0; x <= numColumn; ++x){
        context.beginPath();
        if (debug) {
            context.moveTo(offset + (x * size), 0);
        }
        else {
            context.moveTo(offset + (x * size), offset);
        }
        context.lineTo(offset + (x * size), offset + (size * (numRow - 2)));
        context.stroke();
    }

    for (let y = 0; y < ((debug) ? (numRow + 1) : (numRow - 1)); ++y){
        let start = (debug) ? 0 : offset;
        context.beginPath();
        context.moveTo(offset, start + (y * size));
        context.lineTo(offset + (size * numColumn), start + (y * size));
        context.stroke();
    }
}


// Create squares
// move fill to if-statement for actual rendering function
let DrawAllSquares = function() {
    for (let x = 0; x < numColumn; ++x){
        for (let y = 0; y < numRow; ++y){
            Grid[x][y].fill = true;
            context.fillStyle = Grid[x][y].color;
            context.fillRect(offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne, sizeFill, sizeFill);
        }
    } //*/
}

let DrawRandomSquares = function() {
    for (let x = 0; x < numColumn; ++x) {
        for (let y = 0; y < numRow; ++y) {
            //console.log(x + ", " + y);
            random = Math.floor(Math.random() * 2);

            Grid[x][y].fill = (random == 0) ? true : false;

            if (Grid[x][y].fill) {
                //context.fillStyle = Grid[x][y].color;
                random = Math.floor(Math.random() * 7);
                switch(random) {
                    case 0:
                        Grid[x][y].color = Orange;
                        break;
                    case 1:
                        Grid[x][y].color = Red;
                        break;
                    case 2:
                        Grid[x][y].color = Green;
                        break;
                    case 3:
                        Grid[x][y].color = Blue;
                        break;
                    case 4:
                        Grid[x][y].color = Yellow;
                        break;
                    case 5:
                        Grid[x][y].color = Magenta;
                        break;
                    case 6:
                        Grid[x][y].color = Cyan;
                        break;

                }

                context.fillStyle = Grid[x][y].color;
                //context.fillRect(Grid[x][y].x + sizePointOne, Grid[x][y].y + sizePointOne, sizeFill, sizeFill);
                //console.log("Drew Grid[" + x + "][" + y + "]");
                context.fillRect(offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne, sizeFill, sizeFill);
            }
        }
    }
}

let RedrawSquares = function() {
    for (let x = 0; x < numColumn; ++x) {
        for (let y = 0; y < 22; ++y) {
                if (Grid[x][y].fill) {
                    context.fillStyle = Grid[x][y].color;
                    context.fillRect(offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne, sizeFill, sizeFill);
            }
        }
    }
}

let step = 0;
let start = false;
let now = 0;
let delta = 0;

let fps = 15
let timestep = 1000/fps;

let Draw = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    DrawGrid();
    //DrawAllSquares();
    //DrawRandomSquares();
    //RedrawSquares();
    DrawPiece();
}

let Redraw = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    DrawGrid();
    RedrawSquares();
    DrawPiece();
}

let Render = function() {
    if (start == 0) { start = Date.now(); }
    delta = now - start;
    now = Date.now();

    //console.log(delta);
    //console.log( Piece[3].x + ", " + Piece[3].y);

    if (delta > timestep) {
        start = 0;

        //DropPiece();

        Draw();
    }

    if (!pause) { window.requestAnimationFrame(Render); }
}


// Render Loops

CreateGrid();
CreatePiece();

DrawGrid();
//DrawAllSquares();
DrawPiece();
//DrawRandomSquares();

window.requestAnimationFrame(Render);
