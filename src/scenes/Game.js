import { Scene } from 'phaser'
import { Maze } from '../Maze.js'


const TILE_NO_WALL = 0
const TILE_LEFT_WALL = 1
const TILE_TOP_WALL = 2
const TILE_LEFT_TOP_WALL = 3


const MAZE_WIDTH = 16
const MAZE_HEIGHT = 16

function getWallTile(maze, x, y) {
    if(x  === maze.getWidth() && y === maze.getHeight()) {
        return TILE_NO_WALL
    }
    if(x  === maze.getWidth() && y < maze.getHeight()) {
        return TILE_LEFT_WALL
    }
    if(x  < maze.getWidth() && y === maze.getHeight()) {
        return TILE_TOP_WALL
    }
    const cell = maze.getCell(x, y)
    const leftWall = cell.getLeftWall()
    const topWall = cell.getTopWall()
    if(leftWall && topWall) {
        return TILE_LEFT_TOP_WALL
    }
    if(leftWall) {
        return TILE_LEFT_WALL
    }
    if(topWall) {
        return TILE_TOP_WALL
    }
    return TILE_NO_WALL
    

}


function createMazeMapData(maze) {
    const mapData = new Array(maze.getHeight() + 1)
    for (let y = 0; y <= maze.getHeight(); y++) {
        mapData[y] = new Array(maze.getWidth() + 1)
        for (let x = 0; x <= maze.getWidth(); x++) {
           mapData[y][x] = getWallTile(maze, x, y)             
        }
    }
    return mapData
}


export class Game extends Scene
{
    constructor () {    
        super('Game')
        this.isMazeDrawingInProgress = true
    }

    preload (){
        this.load.setPath('assets');
        this.load.image('tiles', 'bricks.png')
        this.load.image('walls', 'walls.png')        
    }

    create ()
    {
        this.maze = new Maze(MAZE_WIDTH, MAZE_HEIGHT)        
        //this.maze.removeRandomWalls()
        this.mapData = createMazeMapData(this.maze)

        this.map = this.make.tilemap({ data: this.mapData, tileWidth: 32, tileHeight: 32 })
        const tileset = this.map.addTilesetImage('walls')
        this.layer = this.map.createLayer(0, tileset)        

        this.maze.removeRandomWallsStart(this.maze.getCell(0, 0))
    }    

    update () {  
        if(this.isMazeDrawingInProgress) {        
            this.mazeDrawAnimation()
        }
    }

    mazeDrawAnimation() {
        const changedCells = this.maze.removeRandomWall()        
        if(changedCells) {            
            let {x, y} = changedCells[0]
            let {x:x1, y:y1} = changedCells[1]            
            this.map.putTileAt(getWallTile(this.maze, x, y), x, y)            
            this.map.putTileAt(getWallTile(this.maze, x1, y1), x1, y1)
        }
        else {
            this.isMazeDrawingInProgress = false
        }
    }
}