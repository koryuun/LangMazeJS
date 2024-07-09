


class Cell {    
    constructor( x, y ) {
        this._x = x
        this._y = y
        this._wall = true
    }

    getX() {
        return this._x
    }

    getY() {
        return this._y
    }

    isWall() {
        return this._wall
    }

    setWall( value ) {
        this._wall = value
    }

}

export class Maze2 {
    static EMPTY = 0
    static WALL = 1

    constructor( width, height ) {
        this._width = width
        this._height = height
        this.stack = []
        this._maze = []
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this._maze.push(new Cell(x, y))
            }     
        }
    }

    _getCell( x, y ) {
        if(x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return null
        }
        return this._maze[y * this._width + x]
    }

    getWidth() {
        return this._width
    }

    getHeight() {    
        return this._height
    }

    isWall( x, y ) {
        if(x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return false
        }

        return this._maze[y * this._width + x].isWall()
    }

    setWall( x, y, value = true ) {
        this._getCell( x, y ).setWall( value )
    }

    removeWall( x, y ) {
        this.setWall( x, y, false )
    }

    fillRandomWalls() {
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                this.setWall( x, y, Math.random() > 0.5 )                                
            }
        }
    }

    
    // Проверяет что стену можно убрать слева от указанной ячейки
    canRemoveLeftWall( x, y ) {         
        return this.isWall(x - 1, y) && this.isWall(x - 2, y) &&
            this.isWall(x - 2, y - 1) && this.isWall(x - 2, y + 1) &&
            this.isWall(x - 1, y - 1) && this.isWall(x - 1, y + 1)
    }

    // Проверяет что стену можно убрать справа от указанной ячейки
    canRemoveRightWall( x, y ) {         
        return this.isWall(x + 1, y) && this.isWall(x + 2, y) &&
            this.isWall(x + 2, y - 1) && this.isWall(x + 2, y + 1) &&
            this.isWall(x + 1, y - 1) && this.isWall(x + 1, y + 1)
    }

    // Проверяет что стену можно убрать сверху от указанной ячейки
    canRemoveTopCell( x, y ) {
        return this.isWall(x, y - 1) && this.isWall(x, y - 2) &&
            this.isWall(x - 1, y - 2) && this.isWall(x + 1, y - 2) &&
            this.isWall(x - 1, y - 1) && this.isWall(x + 1, y - 1)
    }

    // Проверяет что стену можно убрать снизу от указанной ячейки
    canRemoveBottomCell( x, y ) {
        return this.isWall(x, y + 1) && this.isWall(x, y + 2) &&
            this.isWall(x - 1, y + 2) && this.isWall(x + 1, y + 2) &&
            this.isWall(x - 1, y + 1) && this.isWall(x + 1, y + 1)
    }   
    
    getRandomWall(cell) {
        const x = cell.getX()
        const y = cell.getY()

        const walls = []

        if(this.canRemoveLeftWall(x, y)) {
            walls.push(this._getCell(x - 1, y))
        }
        if(this.canRemoveRightWall(x, y)) {
            walls.push(this._getCell(x + 1, y))
        }
        if(this.canRemoveTopCell(x, y)) {
            walls.push(this._getCell(x, y - 1))
        }
        if(this.canRemoveBottomCell(x, y)) {
            walls.push(this._getCell(x, y + 1))
        }

        return walls.length === 0 ? null : walls[Math.floor(Math.random() * walls.length)]
    }        


    removeRandomWallsStart(cell) {
        this.stack = [cell];
    }

    removeRandomWall() {
        let cell
        let wall = null
        while (wall === null) {
            if (this.stack.length === 0) {
                return false
            }
            cell = this.stack.at(-1)
            wall = this.getRandomWall(cell)
            if (wall === null) {
                this.stack.pop()
            }
        }

        const nextCell = wall
        this.removeWall(wall.getX(), wall.getY())        
        this.stack.push(nextCell)
        return true
    }

    removeRandomWalls() {
        this.removeRandomWallsStart(this._getCell(1, 1))
        while (this.removeRandomWall()) {}
    }


        
}
