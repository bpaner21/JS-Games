// Variables

// Debug switch
let debug = true;

// Reference HTML file
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// The side length of a square in pixels
// Not constant so the app can scale to screen size
let size = 13;

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


// Setup
{
    // Create the playing grid
    let Grid = [];
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

    /* for (let x = 0; x < 10; ++x){
        if (!debug) {
            for (let y = 0; y < 22; ++y){
                Grid[x][y].fill = true;
                context.fillStyle = Grid[x][y].color;
                context.fillRect(Grid[x][y].x + 2, Grid[x][y].y + 2, size - 4, size - 4);
            }
        }
        else {
            for (let y = 0; y < 22; ++y){
                Grid[x][y].fill = true;
                context.fillStyle = Grid[x][y].color;
                context.fillRect(Grid[x][y].x + 2, Grid[x][y].y + 2, size - 4, size - 4);
            }
        }
    } //*/


}