import { Cell } from "./cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Grid {
    constructor(gridElem) {
        this.cells = [];

        console.log('Сетка создана')
        for (let index = 0; index < CELLS_COUNT; index++) {
            this.cells.push(
                new Cell(gridElem, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
            );

        }

        this.cellsGrouppedByColums = this.groupCellsByColum();
        this.cellsGrouppedByReversedColums = this.cellsGrouppedByColums.map(colum => [...colum].reverse());
        this.cellsGrouppedByRows = this.cellsGrouppedByRow();
        this.cellsGrouppedByReversedRows = this.cellsGrouppedByRows.map(colum => [...colum].reverse());
        
    }

    getRandomEmptyCell(){
        const emty = this.cells.filter(a => a.isEmpty());
        const randomIndex = Math.floor(Math.random() * emty.length);
        return emty[randomIndex];
    }

    //Групперуем массив плиток в матрицу из плиток. Или массив столбцов
    groupCellsByColum() {
        return this.cells.reduce((gruppedCells, cell)=> {
            gruppedCells[cell.x] = gruppedCells[cell.x] || [];
            gruppedCells[cell.x][cell.y] = cell;
            return gruppedCells;
        }, [])
    }

    cellsGrouppedByRow() {
        return this.cells.reduce((gruppedCells, cell)=> {
            gruppedCells[cell.y] = gruppedCells[cell.y] || [];
            gruppedCells[cell.y][cell.x] = cell;
            return gruppedCells;
        }, [])

    }

    deleteAllTiles(gameBoard) {
        this.cells.forEach(cell => 
            {
                if (!!cell.linkedTile){

                    cell.linkedTile.removeFromDOM();
                    cell.unlinkTile();
                    
                }
            }
        )
    }
}