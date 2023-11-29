import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("board");
const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setUpInput();

function setUpInput() {
    window.addEventListener("keydown", handleInput, {once : true});
}

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()){
                setUpInput();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                setUpInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":  
            if(!canMoveLeft()){
                setUpInput();
                return;
            }
            await moveLeft(); 
            break;        
        case "ArrowRight": 
            if(!canMoveRight()){
                setUpInput();
                return;
            }
            await moveRight();   
            break;
        default:
            setUpInput();
            return;
    }

    const newTile = new Tile(gameBoard);
    grid.getRandomEmptyCell().linkTile(newTile);

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        alert("Еще раз?");
        return;
    }

    setUpInput();
}

async function moveUp() {
    await slideTiles(grid.cellsGrouppedByColums);
}

async function slideTiles(gruppedCells) {

    const promises = [];

    gruppedCells.forEach(groupOfCells => {
        slideTilesInGroup(groupOfCells, promises);
    });

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

async function moveDown() {
    await slideTiles(grid.cellsGrouppedByReversedColums)
}

async function moveLeft() {
    await slideTiles(grid.cellsGrouppedByRows);
}

async function moveRight() {
    await slideTiles(grid.cellsGrouppedByReversedRows)
}
// первая ячейка не двигается, поэтому итерируемся с i = 1
//
function slideTilesInGroup(group, promises){
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()){
            continue;
        }
        
        const cellWithTile = group[i];

        let targetCell;
        let j = i - 1;
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }

        if(!targetCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

        if (targetCell.isEmpty()){
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unlinkTile();
    }

}

function canMove(gruppedCells) {
    return gruppedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, indx ) => {
        if(indx === 0){
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targenCell = group[indx -1];
        return targenCell.canAccept(cell.linkedTile);
    })
}

function canMoveUp() {
    return canMove(grid.cellsGrouppedByColums);
}

function canMoveDown() {
    return canMove(grid.cellsGrouppedByReversedColums);
}

function canMoveLeft() {
    return canMove(grid.cellsGrouppedByRows);
}

function canMoveRight() {
    return canMove(grid.cellsGrouppedByReversedRows);
}