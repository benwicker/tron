import { Grid } from "./grid";
import { GameBoard } from "@/models/game-board.js";
import { GameStates } from "@/models/enums.js";


export class Game {
    constructor (players, settings, canvas) {
        // values from input
        this.sizeX = settings.gameWidth;
        this.sizeY = settings.gameHeight;
        this.players = players;
        this.settings = settings;
        this.canvas = canvas;

        // init
        this.ctx = this.canvas.getContext("2d");
        this.gameState = GameStates.NOT_STARTED;
        this.crashedPlayers = [];
        this.gameBoard = new GameBoard(this.sizeX, this.sizeY);
        this.grid = new Grid(this.canvas.width, this.canvas.height, this.sizeX, this.sizeY);
        this.raf = null;
        this.startTime = null;

        // 2D objects
        this.gridPath = new Path2D();
        this.overlayPath = new Path2D();
    }

    initGame() {
        // draw grid
        this.gridPath = this.grid.createGrid();
        this.ctx.strokeStyle = this.settings.gridColor;
        this.ctx.stroke(this.gridPath);

        // get player 2d objects
        this.players.forEach((p) => {
            p.path.addPath(this.grid.draw(p.x, p.y));
            this.ctx.fillStyle = p.color;
            this.ctx.fill(p.path);
        });

        // get text overlay
        // todo: implement this section
    }

    start() {
        if (this.gameState == GameStates.NOT_STARTED || this.gameState == GameStates.PAUSED) {
            this.gameState = GameStates.IN_PROGRESS;
            this.raf = window.requestAnimationFrame(this.updateGame.bind(this));
        }

        else if (this.gameState == GameStates.IN_PROGRESS) {
            this.gameState = GameStates.PAUSED;
            window.cancelAnimationFrame(this.raf);
            this.raf = 0;
        }
    }

    updateGame(timestamp) {
        this.startTime = this.startTime || timestamp; // initialize as needed
        let timeElapsed = (timestamp - this.startTime) / 10;
        
        if (timeElapsed >= this.settings.gameSpeed) {
            this.startTime = timestamp;
            this.players.forEach((p) => {
                p.move();
                let crashed = this.detectOutOfBounds(p.x, p.y);

                if (crashed) {
                    this.gameOver();
                    return;
                }

                p.path.addPath(this.grid.draw(p.x, p.y));
                this.ctx.fillStyle = p.color;
                this.ctx.fill(p.path);
            });
        }

        if (this.raf) {
            this.raf = window.requestAnimationFrame(this.updateGame.bind(this));
        }
    }

    gameOver() {
        this.gameState = GameStates.GAME_OVER;
        window.cancelAnimationFrame(this.raf);
        this.raf = 0;
        alert("GAME OVER");
    }

    detectOutOfBounds(x, y) {
        return (x < 0 || x > this.sizeX || y < 0 || y > this.sizeY);
    }

}




// this.players.forEach((p, i) => {
//     // move each player
//     p.move();

//     // detect out of bounds
//     // if (p.x < 0 || p.y < 0 || p.x >= this.numUnits || p.y >= this.numUnits) {
//     //     inactivePlayers.push(this.players.splice(i, 1));
//     //     continue;
//     // }

//     // detect player collision
//     // detect line collision
//     // update board
//     // redraw player
//     this.draw(p.x, p.y, path);
// });