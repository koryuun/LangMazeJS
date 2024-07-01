import { Scene } from 'phaser'
import { Maze, ExternWall, Wall } from '../Maze'


const CELL_SIZE = 20
const MAZE_WIDTH = 30
const MAZE_HEIGHT = 30

const MAZE_X = 400 - (MAZE_WIDTH * CELL_SIZE) / 2
const MAZE_Y = 400 - (MAZE_HEIGHT * CELL_SIZE) / 2

function drawCanvasCell(ctx, cell, x, y) {
    ctx.beginPath()
    if(cell.getLeftWall()) {        
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + CELL_SIZE)
    }

    if(cell.getTopWall()) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + CELL_SIZE, y)
    }
    
    if(cell.getRightWall() instanceof ExternWall) {
        ctx.moveTo(x + CELL_SIZE, y)
        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE)
    }

    if(cell.getBottomWall() instanceof ExternWall) {
        ctx.moveTo(x, y + CELL_SIZE)
        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE)
    }

    ctx.stroke()
}

function drawCanvasMaze(ctx, maze) {
    ctx.clearRect(0, 0, MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);

    for (let y = 0; y < maze.getHeight(); y++) {
        for (let x = 0; x < maze.getWidth(); x++) {
            const cell = maze.getCell(x, y);
            drawCanvasCell(ctx, cell, x * CELL_SIZE, y * CELL_SIZE)
        }
    }
}

export class Game extends Scene
{
    constructor () {    
        super('Game');
    }

    preload (){
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');  

        this.maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT);  
        this.maze.removeRandomWallsStart(this.maze.getCell(0, 0)) 
        //this.maze.removeRandomWalls()   
    }

    create ()
    {
        
        //this.add.image(512, 384, 'background')
        //this.add.image(512, 350, 'logo').setDepth(100)

        /*
        this.add.text(512, 490, 
            'Это начало опыта с Phaser', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)        
        */
        
        this.mazeTexture = this.textures.createCanvas('maze',
            MAZE_WIDTH * CELL_SIZE+10, MAZE_HEIGHT * CELL_SIZE + 10);

        this.c = this.mazeTexture.getSourceImage();
        const ctx = this.c.getContext('2d');

        drawCanvasMaze(ctx, this.maze)

        this.add.image(MAZE_X, MAZE_Y, 'maze').setOrigin(0);
    }    

    update () {         
        if(this.maze.removeRandomWall())           
        {
            const ctx = this.c.getContext('2d');
            drawCanvasMaze(ctx, this.maze)
            this.mazeTexture.refresh()
        }         
    }
}