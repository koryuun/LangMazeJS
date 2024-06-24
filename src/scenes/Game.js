import { Scene } from 'phaser'
import { Maze, ExternWall, Wall } from '../Maze'


const CELL_SIZE = 30
const MAZE_WIDTH = 20
const MAZE_HEIGHT = 20

const MAZE_X = 512 - (MAZE_WIDTH * CELL_SIZE) / 2
const MAZE_Y = 384 - (MAZE_HEIGHT * CELL_SIZE) / 2


function drawMaze(graphics, maze, baseX = 0, baseY = 0) {
    for (let y = 0; y < maze.getHeight(); y++) {
        for (let x = 0; x < maze.getWidth(); x++) {
            const cell = maze.getCell(x, y);
            const cellX = x * CELL_SIZE + baseX;
            const cellY = y * CELL_SIZE + baseY;
            const leftWall = cell.getLeftWall()
            if (leftWall) {
                if(leftWall instanceof ExternWall) {    
                    graphics.lineStyle(2, 0xFFFF00, 1.0);                                        
                } else {
                    graphics.lineStyle(1, 0x000000, 1.0);                    
                }   
                graphics.lineBetween(cellX, cellY, cellX, cellY + CELL_SIZE)
                
            }

            const topWall = cell.getTopWall()
            if (topWall) {
                if(topWall instanceof ExternWall) {    
                    graphics.lineStyle(2, 0xFFFF00, 1.0);                    
                } else {
                    graphics.lineStyle(1, 0x000000, 1.0);                    
                }   
                graphics.lineBetween(cellX, cellY, cellX + CELL_SIZE, cellY)

                
            }               
                    
            graphics.lineStyle(2, 0xFFFF00, 1.0);

            if(x === maze.getWidth() - 1) {
                if (cell.getRightWall()) {                    
                    graphics.lineBetween(cellX + CELL_SIZE, cellY, cellX + CELL_SIZE, cellY + CELL_SIZE);
                }
            }
            if(y === maze.getHeight() - 1) {
                if (cell.getBottomWall()) {                    
                    graphics.lineBetween(cellX, cellY + CELL_SIZE, cellX + CELL_SIZE, cellY + CELL_SIZE);
                }
            }            
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
        this.maze.removeRandomWalls()   
    }

    createGraphics() {
        // Create a graphics object
        const graphics = this.add.graphics({ x: MAZE_X, y: MAZE_Y });
        
    
        // Draw the maze
        drawMaze(graphics, this.maze);
    
        // Return the graphics object
        return graphics;
    }
    


    create ()
    {
        
        this.add.image(512, 384, 'background')
        //this.add.image(512, 350, 'logo').setDepth(100)

        /*
        this.add.text(512, 490, 
            'Это начало опыта с Phaser', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)        

        */
        const gr = this.createGraphics();
        //Phaser.Display.Align.In.Center(block, pic);
    }
}
