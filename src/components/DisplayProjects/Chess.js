import React, { useState, useEffect } from "react";
import whitePawn from "./ChessImages/white/pawn.png"
import whiteBishop from "./ChessImages/white/bishop.png"
import whiteKing from "./ChessImages/white/king.png"
import whiteKnight from "./ChessImages/white/knight.png"
import whiteQueen from "./ChessImages/white/queen.png"
import whiteRook from "./ChessImages/white/rook.png"
import blackPawn from "./ChessImages/black/pawn.png"
import blackBishop from "./ChessImages/black/bishop.png"
import blackKing from "./ChessImages/black/king.png"
import blackKnight from "./ChessImages/black/knight.png"
import blackQueen from "./ChessImages/black/queen.png"
import blackRook from "./ChessImages/black/rook.png"
import transparent from "./ChessImages/blank.png"



const Chess = function ({onMountChess}) {
    let boxWidth = Math.min(document.documentElement.clientWidth * 0.8 - 60, document.documentElement.clientHeight * 0.8 - 60);
    let boxHeight = boxWidth.valueOf();
    let curHighlighted = [];
    let curPossibleMoves = [];

        /*
        pieces:
        1: pawn
        2: rook
        3: knight
        4: bishop
        5: queen
        6: king
        */

    const [playerColor, setPlayerColor] = useState(Math.round(Math.random()));
    const [curBoard, setCurBoard] = useState(setupBoard);
    let pieces = [["", whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing], ["", blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing]];
    
    useEffect(() => {
        onMountChess([curBoard, setCurBoard]);
      }, [onMountChess, curBoard]);

    function setupBoard() {
        let aiColor = Math.abs(playerColor-1);
        let freshBoard = [
            [{player: aiColor, piece: 2}, {player: aiColor, piece: 3}, {player: aiColor, piece: 4}, {player: aiColor, piece: 5}, {player: aiColor, piece: 6}, {player: aiColor, piece: 4}, {player: aiColor, piece: 3}, {player: aiColor, piece: 2}],
            [],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [],
            [{player: playerColor, piece: 2}, {player: playerColor, piece: 3}, {player: playerColor, piece: 4}, {player: playerColor, piece: 5}, {player: playerColor, piece: 6}, {player: playerColor, piece: 4}, {player: playerColor, piece: 3}, {player: playerColor, piece: 2}],
        ];
        for (let i = 0; i < 8; i++) {
            freshBoard[1].push({player: aiColor, piece: 1});
            freshBoard[6].push({player: playerColor, piece: 1});
        }
        if (playerColor == 1) {
            let temp = freshBoard[0][3];
            freshBoard[0][3] = freshBoard[0][4];
            freshBoard[0][4] = temp;

            let secondTemp = freshBoard[7][3];
            freshBoard[7][3] = freshBoard[7][4];
            freshBoard[7][4] = secondTemp;
        }
        return freshBoard;
    }
    /*
    if (curBoard[0][0] === undefined) {
        setupBoard();
    }*/

    function getImage(pieceObj) {
        if (pieceObj === 0 || pieceObj === undefined) {
            return (<img src ={transparent} onClick={activateTile} draggable="false" style={{opacity: 0}} onDragOver={allowDrop} onDrop={endDrag}></img>);
        }
        return(<img src={pieces[pieceObj.player][pieceObj.piece]} draggable="true" onClick={activateTile} onDragStart={testDrag} onDragOver={allowDrop} onDrop={endDrag} onDragEnd={oobHelper}></img>);
    }

    function allowDrop(e) {
        e.preventDefault();
    }

    function oobHelper(e) {
        e.target.style = "display: block;";
    }

    function endDrag(e) {
        e.preventDefault();
        let pieceFrom = e.dataTransfer.getData("fromIndex");
        let pieceMoved = curBoard[pieceFrom[0]][pieceFrom[1]];
        let curTile = e.target.parentElement.id;
        let newBoard = curBoard.slice();
        document.getElementById(pieceFrom).children[0].style="transform: none; display: auto;";
        if (isValidMove(pieceMoved, pieceFrom, curTile)) {
            console.log("yes");
            console.log(pieceFrom);
            console.log(curTile);
            newBoard[pieceFrom[0]][pieceFrom[1]] = 0;
            newBoard[curTile[0]][curTile[1]] = pieceMoved;
            curHighlighted[0].style.backgroundColor = "";
            for (let i = 0; i < curPossibleMoves.length; i++) {
                if (curPossibleMoves[i].parentElement) {
                    curPossibleMoves[i].parentElement.removeChild(curPossibleMoves[i]);
                }
            }
            curPossibleMoves = [];
            setCurBoard(newBoard);
        } else {
            //not valid move, go back to original square
            console.log("no");
            let oldPiece = document.getElementById(pieceFrom);
            let oldChild = oldPiece.children[0];
            oldChild.style = "display: block;";
        }
    }

    function isValidMove(piece, fromIndex, toIndex) {
        if (piece.player != playerColor) {
            //not your piece!
            return false
        }
        if (curBoard[toIndex[0]][toIndex[1]] != 0) {
            if (curBoard[toIndex[0]][toIndex[1]].player == playerColor) {
                return false;
            }
        }
        let deltaX = fromIndex[1] - toIndex[1];
        let deltaY = fromIndex[0] - toIndex[0];
        switch(piece.piece) {
            case 1: 
                //pawn, can move 1 forward, or 2 if it is on the 7th row
                if (deltaX != 0) {
                    return false
                }
                if (deltaY == 1) {
                    return true
                }
                if (fromIndex[0] == 6 && deltaY == 2) {
                    return (curBoard[Number(toIndex[0])+1][toIndex[1]] == 0)
                }
                return false
            case 2:
                //rook, can move any amount in a straight line
                //One and only one of deltaX/deltaY must be 0
                if (deltaX != 0 && deltaY != 0) {
                    return false
                }
                let distance = deltaX + deltaY;
                for (let i = 1; i < Math.abs(distance); i++) {
                    let xOffset = i;
                    let yOffset = i;
                    if (deltaX == 0) {
                        xOffset = 0;
                    } else {
                        if (deltaX < 0) {
                            xOffset = -i;
                        }
                    }
                    if (deltaY == 0) {
                        yOffset = 0;
                    } else {
                        if (deltaY < 0) {
                            yOffset = -i;
                        }
                    }
                    if (curBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] != 0) {
                        return false
                    }
                }
                return true;
            case 3: 
                //knight, moves 2, turns, moves 1
                //deltax +- 2 and deltay +- 1 OR deltax +- 1 and deltay +- 2
                let xMoveKnight = Math.abs(deltaX);
                let yMoveKnight = Math.abs(deltaY);
                return ((xMoveKnight == 2 && yMoveKnight == 1) || (xMoveKnight == 1 && yMoveKnight == 2))
            case 4:
                //bishop, moves diagonal
                let xMoveBishop = Math.abs(deltaX);
                let yMoveBishop = Math.abs(deltaY);
                if (xMoveBishop != yMoveBishop) {
                    return false
                }
                for (let i = 1; i < xMoveBishop; i++) {
                    let xOffset = i;
                    let yOffset = i;
                    if (deltaX < 0) {
                        xOffset = -i;
                    }
                    if (deltaY < 0) {
                        yOffset = -i;
                    }
                    if (deltaX == 0) {
                        xOffset = 0;
                    }
                    if (deltaY == 0) {
                        yOffset = 0;
                    }
                    if (curBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] != 0) {
                        return false
                    }
                }
                return true
            case 5:
                //queen, moves like rook or bishop
                let xMoveQueen = Math.abs(deltaX);
                let yMoveQueen = Math.abs(deltaY);
                if (xMoveQueen != yMoveQueen && deltaX != 0 && deltaY != 0) {
                    return false
                }
                let queenDistance = xMoveQueen;
                if (xMoveQueen == 0 || yMoveQueen == 0) {
                    queenDistance = xMoveQueen + yMoveQueen;
                }
                for (let i = 1; i < queenDistance; i++) {
                    let xOffset = i;
                    let yOffset = i;
                    if (deltaX < 0) {
                        xOffset = -i;
                    }
                    if (deltaY < 0) {
                        yOffset = -i;
                    }
                    if (deltaX == 0) {
                        xOffset = 0;
                    }
                    if (deltaY == 0) {
                        yOffset = 0;
                    }
                    if (curBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] != 0) {
                        return false
                    }
                }
                return true
            case 6:
                //king, moves anywhere within 1 tile
                let xMoveKing = Math.abs(deltaX);
                let yMoveKing = Math.abs(deltaY);
                return (xMoveKing < 2 && yMoveKing < 2)
            default:
                console.log("not a recognized piece");
        }
    }

    function testDrag(e){
        e.dataTransfer.setData("fromIndex", e.target.parentElement.id);
        activateTile(e, true);
        e.target.style = "transform: translate(0,0);";
        e.dataTransfer.setDragImage(e.target, e.target.width/2,e.target.height/2);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    function activateTile(e, isDrag) {
        let tileID = e.target.parentElement.id;
        for (let i = 0; i < curPossibleMoves.length; i++) {
            if (curPossibleMoves[i].parentElement) {
                console.log(curPossibleMoves[i].parentElement.children);
                console.log(curPossibleMoves[i]);
                curPossibleMoves[i].parentElement.removeChild(curPossibleMoves[i]);
            }
        }
        curPossibleMoves = [];
        if (tileID !== ""){
            let curTile = document.getElementById(tileID);
            let sameTile = curTile == curHighlighted[0];
            var colorChange;
            if (Math.floor(tileID / 10) % 2 == 1 != tileID % 2 == 1) {
                //white
                colorChange = "rgb(244,246,142)";
            } else {
                //green
                colorChange = "rgb(184,202,80)";
            }
            if (sameTile && curTile.style.backgroundColor != "" && !isDrag) {
                colorChange = "";
            }
            
            curTile.style.backgroundColor = colorChange;

            if (curHighlighted[0] !== null && curHighlighted[0] !== undefined) {
                if (!sameTile) {
                    curHighlighted[0].style.backgroundColor = "";
                }
            }
            
            curHighlighted[0] = curTile;

            //shows possible moves
            let movedFrom = e.target.parentElement.id;
            for (let i = 0; i < curBoard.length; i++) {
                for (let j = 0; j < curBoard.length; j++) {
                    if (isValidMove(curBoard[movedFrom[0]][movedFrom[1]], movedFrom, String(i)+j)) {
                        //document.getElementById(String(i)+j).style.backgroundColor = "red";
                        //curPossibleMoves.push(String(i)+j);
                        let parentNode = document.getElementById(String(i)+j);
                        let smallCircle = document.createElement("div");
                        smallCircle.style.backgroundColor = "red";
                        console.log(parentNode.offsetHeight);
                        smallCircle.style.height = parentNode.offsetHeight + "px";
                        smallCircle.style.width = parentNode.offsetWidth + "px";
                        smallCircle.style.position = "absolute";
                        smallCircle.style.pointerEvents = "none";
                        smallCircle.style.left = parentNode.offsetLeft + "px";
                        smallCircle.style.top = parentNode.offsetTop + "px";
                        //smallCircle.style.opacity = "1";
                        document.getElementById(String(i)+j).appendChild(smallCircle);
                        console.log(document.getElementById(String(i)+j));
                        curPossibleMoves.push(smallCircle);
                    }
                }
            }
        }
    }


    return(<div>
        <div className="chessBoard">
        <div className="chessBoardTiles" style={{gridTemplateColumns: `repeat(8, ${boxWidth/8}px)`, gridTemplateRows: `repeat(8, ${boxHeight/8}px)`}}>
            {curBoard.map((row, index) => (
                row.map((tile, innerIndex) => (
                    <div key={index+innerIndex} id={String(index)+innerIndex}>
                        {getImage(tile)}
                    </div>
                ))
            ))}
        </div>
    </div>
    </div>
    );
};

export default Chess;