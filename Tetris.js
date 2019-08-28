// Variables
{
    // Debug switch
    let debug = true;

    // Reference HTML file
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    // The distance from the screen edge in pixels
    const offset = 20;

    // The side length of a square in pixels
    // Not constant so the app can scale to screen size
    let size = 12;

    // The basic square that defines the grid, tetris blocks
    const Square = class{
        constructor(fill, color, x, y){
            this.fill = fill;
            this.color = color;
            this.x = x;
            this.y = y;
        }
    }
}

// Setup
{
    // Create the playing grid
    let Grid = [];
    for (let i = 0; i < 10; ++i){
        Grid[i] = [];
        for (let j = 0; j < 22; ++j){
            Grid[i][j] = new Square(false, "#FF00FF", offset + (i *size), (j *size));
        }
    }

    if (!debug) {
        context.rect(offset, offset, (size * 10), (size * 20));
        context.stroke();

        for (let i = 30; i < 120; i += 10){
            context.beginPath();
            context.moveTo(i, 20);
            context.lineTo(i, 220);
            context.stroke();
        }

        for (let j = 30; j < 220; j += 10){
            context.beginPath();
            context.moveTo(20, j);
            context.lineTo(120, j);
            context.stroke();
        }

    }
    else {
        context.rect(offset, 0, (size * 10), (size * 22));
        context.stroke();
        
        for (let i = 30; i < 120; i += 10){
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, 220);
            context.stroke();
        }

        for (let j = 10; j < 220; j += 10){
            context.beginPath();
            context.moveTo(20, j);
            context.lineTo(120, j);
            context.stroke();
        }
    }

    for (let i = 0; i < 10; ++i){
        for (let j = 2; j < 22; ++j){
            Grid[i][j].fill = true;
            context.fillStyle = Grid[i][j].color;
            context.fillRect(Grid[i][j].x + 2, Grid[i][j].y + 2, size - 4, size - 4);
        }
    }
}