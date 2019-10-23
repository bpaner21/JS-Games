/*
Problem Lines (allow for slight changes based on code alterations):
 89 - figure out a more generic copy constructor

*/


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
//  -   -   -   -   -   -   -   -

// Color Hex codes
const Orange = '#FFAA00';
const Red = '#FF0000';
const Green = '#00FF00';
const Blue = '#0000FF';
const Yellow = '#FFFF00';
const Magenta = '#FF00FF';
const Cyan = '#00FFFF';
const Black = '#000000';

// Debug boolean
let debug = false;

// Pause boolean
let pause = false;

// Reference HTML file
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
context.lineWidth = 1;
context.font = '10pt Helvetica';
//context.fillStyle = '#AAAAAA';
//context.fillRect(0,0, context.canvas.width, context.canvas.height);

// The side length of a grid square in pixels
// as well as slight variations used for offsetting and
// rendering populated grid squares and tetris pieces
// This is not a const so that the app can scale to the user's screen size
let size = (window.innerHeight/23);
let sizePointOne = (size * 0.15);
let sizePointTwo = (size * 0.3);
let sizeFill = size - sizePointTwo;

// number variable for calculating randomness
let random = 0;

// numColumn was originally not constant while setting up the grid functions
// let numColumn = (debug) ? (Math.floor(window.innerWidth / size) - 2) : 10;

// numRow is not constant for visualization purposes while debugging
const numColumn = 10;
let numRow = 22;

// The distance from the screen edge in pixels
let offset = size * 2;

// Boolean to check if a piece is rotating or not
let rotating = false;

const numPieces = 4;

pieceInformation = [ // this game uses [][2][] as the axis of rotation, I should probably move that to [][0][] to make it more universal
    [ [3,2], [4,2], [5,2], [6,2] ],
    [ [4,2], [5,2], [4,3], [5,3] ],
    [ [5,2], [4,3], [5,3], [6,3] ],
    [ [6,2], [4,3], [5,3], [6,3] ],
    [ [4,2], [4,3], [5,3], [6,3] ],
    [ [4,2], [5,2], [5,3], [6,3] ],
    [ [5,2], [6,2], [5,3], [4,3] ]
];

/*
Use the SRS system to create rotations
add bounding box field to Piece class data (Change Piece to class first)
line = 4 bounding
square = 2 bounding
other five pieces = 3 bounding
*/

// The basic square that defines the grid and tetris blocks
const Square = class {

    constructor(color = null, x = 0, y = 0) {
        this.fill = false;       // boolean, is this square of the grid filled or not
        this.color = color;     // string, hex value to determine color of square
        this.x = x;             // double, x position of square (the upper left corner)
        this.y = y;             // double, y position of square (the upper left corner)
        this.centerX = x + 0.5; // double, the visual center x of the square
        this.centerY = y + 0.5; // double, the visual center y of the square
    }
}

const Grid = [];

let Piece = [];

let PieceLastStep = [];

let step = 0;
let start = false;
let now = 0;
let delta = 0;

let fps = 15
let timeStep = 1000/fps;

const radianSin = Math.sin(Math.PI/2);
const radianCos = Math.cos(Math.PI/2);

let lose = false;

let lastPiece = null;

// Functions
//  -   -   -   -   -   -   -   -

// Event Listeners

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
            if (Piece.every(Piece => Piece['x'] > 0)) {
                PieceX(-1);
            }
            break;
        case 39: // Right
            if (Piece.every(Piece => Piece['x'] < 9)) {
                PieceX(1);
            }
            break;
        case 40: // down
            if (!rotating) {
                RotatePiece();
            }
            break;
    }
});

// Setup
const Resize = () => {
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

const CreateGrid = () => {
    // Create the playing grid
    for (let x = 0; x < numColumn; ++x){
        Grid[x] = [];
        for (let y = 0; y < numRow; ++y){
            Grid[x][y] = new Square("#FF00FF", x, y);
        }
    }
    console.log(Grid);
}

// Piece functions

const CreatePiece = () => { 
    let _randomPiece = Math.floor(Math.random() * 7);

    switch(random) {
        case 0:
            _randomPiece = Orange;
            break;
        case 1:
            _randomPiece = Red;
            break;
        case 2:
            _randomPiece = Green;
            break;
        case 3:
            _randomPiece = Blue;
            break;
        case 4:
            _randomPiece = Yellow;
            break;
        case 5:
            _randomPiece = Magenta;
            break;
        case 6:
            _randomPiece = Cyan;
            break;

    }//*/

    for (let x = 0; x < numPieces; ++x) {
        Piece[x] = new Square();
        Piece[x] = {...Grid[5][x + 2]};
        Piece[x].color = _randomPiece;
    }
}

const LogPiece = () => {
    for (let i of Piece) {
        console.log(i);
    }
}

const DrawPiece = () => {

    // Draw each square of a piece 
    context.fillStyle = Piece[0].color;

    for (let i = 0; i < numPieces; ++i) {
        context.fillRect(offset + (Piece[i].x * size) + sizePointOne, (Piece[i].y * size) + sizePointOne, sizeFill, sizeFill);
    }

    // Draw a number identifying the index of a square within the Piece array 
    context.fillStyle = Black;
    for (let n = 0; n < numPieces; ++n) {
        context.fillText(n, offset + (Piece[n].x * size) + sizePointOne, (Piece[n].y * size) + sizePointOne);
    }

    // Draw a circle to identify the relative origin the squares in a piece rotate around.
    context.strokeStyle = Blue;
    context.beginPath();
    context.arc(offset + ((Piece[2].x) * size), (Piece[2].y * size), size, 0, 2 * Math.PI);
    context.stroke();
}

const CheckPiece = () => {
    if (Piece.some(Piece => Piece['y'] >= 22 || Piece['x'] < 0 || Piece['x'] >= 10)) {
        //return "Pieces out of bounds";
        console.log("Pieces would move out of bounds");
        return false;
    }
    else if (Piece.some(Piece => Grid[ Piece['x'] ][ Piece['y'] ].fill)) {
        //return "Grid space occupied";
        console.log("Grid space occupied");
        return false;
    }
    
    //return "Pieces in bounds, grid spaces empty";
    console.log("Pieces will remain in bounds, grid spaces empty");
    return true;
}

const DropPiece = () => {
    //console.log(CheckPiece());
    //if (Piece.every(Piece => Piece['y'] < 21)) 
    console.log("DropPiece");
    PieceLastStep = [...Piece];
    for (let i = 0; i < numPieces; ++i) {
        ++Piece[i].y;
    }

    if (!CheckPiece()) {
        //console.log(CheckPiece());
        console.log("DropPiece Failed");
        Piece = [...PieceLastStep];
    }

}

const PieceX = xChange => {
    if (CheckPiece()) {
        for (let i = 0; i < numPieces; ++i) {
            Piece[i].x += xChange;
        }
    }

    console.log("PieceX");
    LogPiece();

    return;
}

// As this function is now, it applies the SRS to 5 of the seven pieces
// A check can be added so that the square piece doesn't rotate
// The problem is that this algorithm cannot properly rotate the line piece
// A secondary algorithm is going to need to be added to accommodate that

// Another problem is that after rotating, the piece can clip into filled pieces of the grid

const RotatePiece = () => {
    rotating = true;

    PieceLastStep = [...Piece];

    let px = Piece[2].x;
    let py = Piece[2].y;

    for (let i = 0; i < numPieces; ++i) {
        let a = Piece[i].x - px;
        let b = Piece[i].y - py;

        Piece[i].x = Math.round(px + (a * radianCos) - (b * radianSin));
        Piece[i].y = Math.round(py + (a * radianSin) + (b * radianCos));
    }

    if(!CheckPiece()) {
        Piece = [...PieceLastStep];
        return;
    }
    else {
        PieceLastStep = [...Piece];
    }

    // This is not working properly, rotating pieces still become out of bounds
    // Figure out why
    YShift();
    console.log("YShift:)");
    LogPiece();

    if(!CheckPiece()) {
        Piece = [...PieceLastStep];
    }
    else {
        PieceLastStep = [...Piece];
    }

    XShift();
    console.log("XShift:");
    LogPiece();

    if(!CheckPiece()) {
        Piece = [...PieceLastStep];
    }

    rotating = false;
    return;
}


// This function checks if, after rotating a piece, any of its squares are outside the horizontal bounds of the grid.
// If so, it shifts the pieces' X values until they are back within the bounds of the grid.
// 
const XShift = () => {
    // if every square of the Piece is within the horizontal bounds of the grid, it simply returns
    while (Piece.some(Piece => Piece['x'] < 0) || Piece.some(Piece => Piece['x'] > 9)) {
        // The ternary checks if the piece needs to be shifted left or right
        let shift = Piece.some(Piece => Piece['x'] < 0) ? 1 : -1;

        for (let i = 0; i < numPieces; ++i) {
            Piece[i].x += shift;
        }
    } 

    return;
}

const YShift = () => {
    while (Piece.some(Piece => Piece['y'] > 21))
    {
        for (let i = 0; i < numPieces; ++i) {
            --Piece[i].y;
        }
    }

    return;
} 

const FillGrid = () => {
    for( let i = 0; i < numPieces; ++i) {
        Grid[Piece[i].x][Piece[i].y - 1].fill = true;
        Grid[Piece[i].x][Piece[i].y - 1].color = Piece[i].color;
        //Piece[i] = null;
    }
}

// Draw functions

const DrawGrid = () => {
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

    context.fillStyle = Black;
    for (let n = 0; n < numPieces; ++n) {
        context.fillText(n, offset + (Piece[n].x * size) + sizePointOne, (Piece[n].y * size) + sizePointOne);
    }

    for (let x = 0; x < numColumn; ++x){
        for (let y = 0; y < numRow; ++y){
            context.fillText(y, offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne);
        } 
    }
}


// Create squares
// move fill to if-statement for actual rendering function
const DrawAllSquares = () => {
    for (let x = 0; x < numColumn; ++x){
        for (let y = 0; y < numRow; ++y){
            Grid[x][y].fill = true;
            context.fillStyle = Grid[x][y].color;
            context.fillRect(offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne, sizeFill, sizeFill);
        }
    } //*/
}

const DrawRandomSquares = () => {
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

const RedrawSquares = () => {
    for (let x = 0; x < numColumn; ++x) {
        for (let y = 0; y < 22; ++y) {
                if (Grid[x][y].fill) {
                    context.fillStyle = Grid[x][y].color;
                    context.fillRect(offset + (Grid[x][y].x * size) + sizePointOne, (Grid[x][y].y * size) + sizePointOne, sizeFill, sizeFill);
            }
        }
    }
}

const Draw = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    DrawGrid();
    //DrawAllSquares();
    //DrawRandomSquares();
    RedrawSquares();
    if (!lose) {
        DrawPiece();
        DropPiece();
        if(!CheckPiece()){
            FillGrid();
            ClearRow();
            if (!Grid[5][2].fill) {
                CreatePiece();
            }
            else {
                lose = true;
            }
        }
    }
}

const Redraw = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    DrawGrid();
    RedrawSquares();
    DrawPiece();
}

const Render = () => {
    if (start == 0) { start = Date.now(); }
    delta = now - start;
    now = Date.now();

    //console.log(delta);
    //console.log( Piece[3].x + ", " + Piece[3].y);

    if (delta > timeStep) {
        start = 0;

        //DropPiece();

        Draw();
    }

    if (!pause) { window.requestAnimationFrame(Render); }
}


// Render Loops

window.addEventListener('resize', Resize);

CreateGrid();
CreatePiece();

DrawGrid();
//DrawAllSquares();
DrawPiece();
//DrawRandomSquares();

window.requestAnimationFrame(Render);

const ClearRow = () => {
    let y = 21;
    
    while (y > 1) {
    let count = 0;
    
        for (let x = 0; x < 10; ++x) {
            if (Grid[x][y].fill) {
                ++count;
            }
        } 
    
        if (count == 10) {
            for (a = 0; a < 10; ++a) {
                for(b = y; b > 1; --b){
                    Grid[a][b].fill = Grid[a][b-1].fill;
                    Grid[a][b].color = Grid[a][b-1].color;	
                }	
            }
        }
        else if (count == 0) {
            console.log("Break");
            break;
        }
        else {
            --y;
        }
    }

    return;
}