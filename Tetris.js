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

// Debug switch
let debug = false;

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

// The distance from the screen edge in pixels
const offset = size * 2; 

// The basic square that defines the grid, tetris blocks
const Square = class{
    constructor(fill, color, x, y){
        this.fill = fill;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}

let Grid = [];

// Setup
DrawGrid = function() {
    context.fillStyle = '#AAAAAA';
    context.fillRect(0,0, context.canvas.width, context.canvas.height);

    // Create the playing grid
    for (let x = 0; x < 10; ++x){
        Grid[x] = [];
        for (let y = 0; y < 22; ++y){
            Grid[x][y] = new Square(false, "#FF00FF", offset + (x * size), (y * size));
        }
    }

    if (!debug) {
        context.rect(offset, offset, (size * 10), (size * 20));
        context.stroke();

        for (let x = (offset + size); x < (offset + (size * 10)); x += size){
            context.beginPath();
            context.moveTo(x, offset);
            context.lineTo(x, offset + (size * 20));
            context.stroke();
        }

        for (let y = (offset + size); y < (offset + (size * 20)); y += size){
            context.beginPath();
            context.moveTo(offset, y);
            context.lineTo(offset + (size * 10), y);
            context.stroke();
        }

    }
    else {
        context.rect(offset, 0, (size * 10), (size * 22));
        context.stroke();
        
        for (let x = (offset + size); x < (offset + (size * 10)); x += size){
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, (size * 22));
            context.stroke();
        }

        for (let y = size; y < (size * 22); y += size){
            context.beginPath();
            context.moveTo(offset, y);
            context.lineTo(offset + (size * 10), y);
            context.stroke();
        }
    }
}


// Create squares
// move fill to if-statement for actual rendering function
let DrawAllSquares = function() {
    for (let x = 0; x < 10; ++x){
        if (!debug) {
            for (let y = 0; y < 22; ++y){
                Grid[x][y].fill = true;
                context.fillStyle = Grid[x][y].color;
                context.fillRect(Grid[x][y].x + sizePointOne, Grid[x][y].y + sizePointOne, sizeFill, sizeFill);
            }
        }
        else {
            for (let y = 0; y < 22; ++y){
                Grid[x][y].fill = true;
                context.fillStyle = Grid[x][y].color;
                context.fillRect(Grid[x][y].x + sizePointOne, Grid[x][y].y + sizePointOne, sizeFill, sizeFill);
            }
        }
    } //*/
}

let random = 0;

let DrawRandomSquares = function() {
    for (let x = 0; x < 10; ++ x) {
        for (let y = 0; y < 22; ++y) {
            random = Math.floor(Math.random() * 2);

            if (random == 0) {
                Grid[x][y].fill = true;
            }
            else {
                Grid[x][y].fill = false;
            }

            if (Grid[x][y].fill == true) {
                //context.fillStyle = Grid[x][y].color;
                random = Math.floor(Math.random() * 7);
                switch(random) {
                    case 0:
                        context.fillStyle = '#FFAA00';
                        break;
                    case 1:
                        context.fillStyle = '#FF0000';
                        break;
                    case 2:
                        context.fillStyle = '#00FF00';
                        break;
                    case 3:
                        context.fillStyle = '#0000FF';
                        break;
                    case 4:
                        context.fillStyle = '#FFFF00';
                        break;
                    case 5:
                        context.fillStyle = '#FF00FF';
                        break;
                    case 6:
                        context.fillStyle = '#00FFFF';
                        break;
                    
                }
                context.fillRect(Grid[x][y].x + sizePointOne, Grid[x][y].y + sizePointOne, sizeFill, sizeFill);
            }
        }
    }
}

let step = 0;

Draw = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    console.log(step);
    ++step;

    DrawGrid();
    //DrawAllSquares();
    DrawRandomSquares();
}

let Game = function() {
    requestAnimationFrame(Draw);
}

let Render = window.setInterval(Game, 500);