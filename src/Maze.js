

const LEFT = 0
const RIGHT = 1
const UP = 2
const DOWN = 3


class BaseWall {}

export class Wall extends BaseWall {
    constructor( cell1, cell2 ) {
        super()
        this.cells = [cell1, cell2]
    }

    getCells() {
        return [...this.cells]
    }

    remove() {
        this.cells[0].removeWall(this)   
        this.cells[1].removeWall(this)        
    }

    getOtherCell( cell ) {
        return this.cells[0] === cell ? this.cells[1] : this.cells[0]
    }

}

export class ExternWall extends BaseWall {
    constructor() {
        super()
    }
}

export class Cell {    
    constructor( x, y ) {
        this.x = x
        this.y = y
        this.walls = Array(4).fill(null)
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    isOpen() {
        return this.walls.some(wall => wall === null)
    }
 
    setRightWall(wall) {
        this.walls[RIGHT] = wall
    }
    
    setLeftWall(wall) {
        this.walls[LEFT] = wall
    }
    
    setTopWall(wall) {
        this.walls[UP] = wall
    }
    
    setBottomWall(wall) {
        this.walls[DOWN] = wall
    }

    getRightWall() {
        return this.walls[RIGHT]
    }    
    
    getLeftWall() {
        return this.walls[LEFT]
    }
    
    getTopWall() {
        return this.walls[UP]
    }
    
    getBottomWall() {
        return this.walls[DOWN]
    }

    removeWall( wall ) {        
        this.walls = this.walls.map(w => w === wall ? null : w)
    }

    getRandomWall() {
        const walls = this.walls.filter(wall =>
            wall instanceof Wall &&
            !wall.getOtherCell(this).isOpen()
        );

        return walls.length === 0 ? null : walls[Math.floor(Math.random() * walls.length)];
    }

}


export class Maze {
    constructor( width, height ) {
        this.width = width;
        this.height = height;
        this.maze = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.maze.push(new Cell(x, y));
            }     
        }
        this.stack = []
        this.createAllWalls()        
    }

    getWidth() {
        return this.width
    }

    getHeight() {
        return this.height
    }

    getCell( x, y ) {
        return this.maze[y * this.width + x]
    }


    createCellWalls(x, y) {
        const cell = this.getCell(x, y);
        let wall;
        if (x === 0) {
            wall = new ExternWall();
        } else {
            const leftCell = this.getCell(x - 1, y);
            wall = new Wall(leftCell, cell);
            leftCell.setRightWall(wall);
        }
        cell.setLeftWall(wall);

        if (y === 0) {
            wall = new ExternWall();
        } else {
            const topCell = this.getCell(x, y - 1);
            wall = new Wall(topCell, cell);
            topCell.setBottomWall(wall);
        }
        cell.setTopWall(wall);

        if (x === this.width - 1) {
            wall = new ExternWall();
            cell.setRightWall(wall);
        }

        if (y === this.height - 1) {
            wall = new ExternWall();
            cell.setBottomWall(wall);
        }
    }

    createAllWalls() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.createCellWalls(x, y);
            }
        }
    }

    removeRandomWallsStart(cell) {
        this.stack = [cell];
    }

    removeRandomWall() {
        let cell
        let wall = null
        while (wall === null) {
            if (this.stack.length === 0) {
                return null
            }
            cell = this.stack.at(-1)
            wall = cell.getRandomWall()
            if (wall === null) {
                this.stack.pop()
            }
        }

        const nextCell = wall.getOtherCell(cell)
        const changedCells = [
            {x: cell.getX(), y: cell.getY()},
            {x: nextCell.getX(), y: nextCell.getY()}
        ]
        wall.remove()
        this.stack.push(nextCell)
        return changedCells
    }

    removeRandomWalls() {
        this.removeRandomWallsStart(this.getCell(0, 0))
        while (this.removeRandomWall()) {}
    }
}
