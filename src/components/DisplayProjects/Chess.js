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
import { useWorker } from "@koale/useworker";
import ChessAi from "./ChessAi";

const Chess = function ({onMountChess}) {

    const [aiWorker, {kill: killWorker}] = useWorker(ChessAi);

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

    const [playerColor] = useState(Math.round(Math.random()));
    const [curBoard, setCurBoard] = useState(setupBoard);
    const [playerTurn, setPlayerTurn] = useState(playerColor === 0);
    const [curEval, setCurEval] = useState(0);

    //Castling rights for player left right, ai left right and En Passant column for player, ai
    const [specialConditions] = useState([true, true, true, true, -1, -1])
    let pieces = [["", whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing], ["", blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing]];

    useEffect(() => {
        onMountChess([curBoard, setCurBoard]);
      }, [onMountChess, curBoard]);

      //Web worker to get ai move in a different thread
      const onWorkerAi = () => {
        aiWorker(curBoard, playerColor, specialConditions).then(resultArr => {
            let result = resultArr[0];
            let aiColor = Math.abs(playerColor-1);
            if (result[0][0] === 0) {
                if (specialConditions[2] === true) {
                    specialConditions[2] = false;
                }
            } else {
                if (result[0][0].player !== aiColor) {
                    if (specialConditions[2] === true) {
                        specialConditions[2] = false;
                    }
                }
            }
            if (result[0][7] === 0 || result[0][7].player !== aiColor) {
                if (specialConditions[3] === true) {
                    specialConditions[3] = false;
                }
            } else {
                if (result[0][7].player !== aiColor) {
                    if (specialConditions[3] === true) {
                        specialConditions[3] = false;
                    }
                }
            }
            if (aiColor === 1) {
                if (result[0][4] === 0) {
                    specialConditions[2] = false;
                    specialConditions[3] = false;
                } else  {
                    if (result[0][4].player !== aiColor) {
                        specialConditions[2] = false;
                        specialConditions[3] = false;
                    }
                }
            }
            if (aiColor === 0) {
                if (result[0][3] === 0) {
                    specialConditions[2] = false;
                    specialConditions[3] = false;
                } else {
                    if (result[0][4].player !== aiColor) {
                        specialConditions[2] = false;
                        specialConditions[3] = false;
                    }
                }
            }
            setCurEval(resultArr[1]);
            setCurBoard(result);
            allowMove();
            killWorker();
        });
      };

    function allowMove() {
            for (let i = 0; i < curBoard.length; i++) {
                for (let j = 0; j < curBoard[i].length; j++) {
                    let curTile = document.getElementById(String(i)+j);
                    for (let h = 0; h < curTile.children.length; h++) {
                        if (curTile.children[h].id === "possibleSmallCircle"){
                            curTile.removeChild(curTile.children[h]);
                        }
                    }
                    if (curTile.style.backgroundColor !== "") {
                        curTile.style.backgroundColor = "";
                    }
                }
            }
        setPlayerTurn(true);
    }
    
    function stopMove() {
        setPlayerTurn(false);
    }

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
        if (playerColor === 1) {
            let temp = freshBoard[0][3];
            freshBoard[0][3] = freshBoard[0][4];
            freshBoard[0][4] = temp;

            let secondTemp = freshBoard[7][3];
            freshBoard[7][3] = freshBoard[7][4];
            freshBoard[7][4] = secondTemp;
        }
        return freshBoard;
    }

    //Ai goes first when player is black
    useEffect(() => {
        if (playerColor === 1) {
            stopMove();
            onWorkerAi();   
        }
    }, []);

    function getImage(pieceObj) {
        if (pieceObj === 0 || pieceObj === undefined) {
            return (<img src ={transparent} onClick={clickTile} draggable="false" style={{opacity: 0}} onDragOver={allowDrop} onDrop={endDrag} alt="Empty"></img>);
        }
        return(<img src={pieces[pieceObj.player][pieceObj.piece]} draggable="true" onClick={clickTile} onDragStart={dragPiece} onDragOver={allowDrop} onDrop={endDrag} onDragEnd={oobHelper} id="piece" alt="Piece"></img>);
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
        movePiece(pieceFrom, curTile, pieceMoved, newBoard);
    }

    function clickTile(e) {
        let curTile = e.target.parentElement.id;
        if (curBoard[curTile[0]][curTile[1]] === 0 || curBoard[curTile[0]][curTile[1]].player !== playerColor) {
            //Empty tile
            if (curHighlighted.length > 0) {
                let pieceFrom = curHighlighted[0].id;
                let pieceMoved = curBoard[pieceFrom[0]][pieceFrom[1]];
                let newBoard = curBoard.slice();
                if (!movePiece(pieceFrom, curTile, pieceMoved, newBoard)) {
                    activateTile(pieceFrom, false);
                    curHighlighted = [];
                    curPossibleMoves = [];
                }
            }
        } else {
            //Not empty
            activateTile(curTile, false);
        }
    }

    function movePiece(pieceFrom, curTile, pieceMoved, newBoard) {
        if (curHighlighted.length === 0) {
            return false
        }
        document.getElementById(pieceFrom).children[0].style="transform: none; display: auto;";
        if (isValidMove(pieceMoved, pieceFrom, curTile, playerColor, curBoard) && curHighlighted[0].style.backgroundColor !== "") {
            if (!kingTrouble(pieceMoved, pieceFrom, curTile, playerColor, curBoard)) {
                //valid move
                curHighlighted[0].style.backgroundColor = "";
                
                for (let i = 0; i < curPossibleMoves.length; i++) {
                    if (curPossibleMoves[i].parentElement) {
                        curPossibleMoves[i].parentElement.removeChild(curPossibleMoves[i]);
                    }
                }
                if (playerTurn){
                    newBoard[pieceFrom[0]][pieceFrom[1]] = 0;
                    newBoard[curTile[0]][curTile[1]] = pieceMoved;

                    //castle conditions
                    if (pieceFrom === "70") {
                        if (specialConditions[0] === true) {
                            specialConditions[0] = false;
                        }
                    }
                    if (pieceFrom === "77") {
                        if (specialConditions[1] === true) {
                            specialConditions[1] = false;
                        }
                    }
                    if (pieceMoved.piece === 6) {
                        let deltaX = pieceFrom[1] - curTile[1];
                        if (deltaX === 2) {
                            newBoard[curTile[0]][Number(curTile[1])+1] = newBoard[7][0];
                            newBoard[7][0] = 0;
                        }
                        if (deltaX === -2) {
                            newBoard[curTile[0]][Number(curTile[1])-1] = newBoard[7][7];
                            newBoard[7][7] = 0;
                        }
                        specialConditions[0] = false;
                        specialConditions[1] = false;
                    }

                    if (pieceMoved.piece === 1 && Number(curTile[0]) === 0) {
                        pieceMoved.piece = 5;
                    }


                    stopMove();
                    if (!mateCheck(Math.abs(playerColor-1), newBoard)) {
                        onWorkerAi();
                    } else {
                        endGameCheckMate(playerColor, newBoard);
                    }
                }
                return true;
            }
        } else {
            //not valid move, go back to original square
            let oldPiece = document.getElementById(pieceFrom);
            let oldChild = oldPiece.children[0];
            oldChild.style = "display: block;";
            return false;
        }
    }

    //Returns boolean if king is in trouble
    function kingTrouble(pieceMoved, pieceFrom, curTile, color, board) {
        let tempBoard = [];
        for (let i = 0; i < 8; i++) {
            tempBoard[i] = board[i].slice();
        }
        tempBoard[pieceFrom[0]][pieceFrom[1]] = 0;
        tempBoard[curTile[0]][curTile[1]] = pieceMoved;


        if (pieceMoved.piece === 6) {
            let deltaX = pieceFrom[1] - curTile[1];
            if (deltaX === 2) {
                tempBoard[curTile[0]][Number(curTile[1])+1] = tempBoard[7][0];
                tempBoard[7][0] = 0;
            }
            if (deltaX === -2) {
                tempBoard[curTile[0]][Number(curTile[1])-1] = tempBoard[7][7];
                tempBoard[7][7] = 0;
            }
        }

        if (pieceMoved.piece === 1 && Number(curTile[0]) === 0) {
            tempBoard[curTile[0]][curTile[1]] = {player: pieceMoved.color, piece: 5};
        }

        let kingPos = 0;
        for (let i = 0; i < 8; i ++) {
            for (let j = 0; j < 8; j++) {
                if (tempBoard[i][j] !== 0) {
                    if (tempBoard[i][j].piece === 6 && tempBoard[i][j].player === color) {
                        kingPos = String(i) + j;
                    }
                }
            }
        }

        let oppColor = Math.abs(color-1);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (tempBoard[i][j] !== 0) {
                    if (tempBoard[i][j].player === oppColor) {
                        if (isValidMove(tempBoard[i][j], String(i)+j, kingPos, oppColor, tempBoard)) {
                            return true
                        }
                    }
                }
            }
        }

    }

    function isValidMove(piece, fromIndex, toIndex, color, board) {
        if (piece.player !== color) {
            //not your piece!
            return false
        }
        if (board[toIndex[0]][toIndex[1]] !== 0) {
            if (board[toIndex[0]][toIndex[1]].player === color) {
                return false;
            }
        }
        let deltaX = fromIndex[1] - toIndex[1];
        let deltaY = fromIndex[0] - toIndex[0];
        switch(piece.piece) {
            case 1: 
                //pawn, can move 1 forward, or 2 if it is on the 7th row
                let xMovePawn = Math.abs(deltaX);
                if (color !== playerColor) {
                    deltaY = -deltaY;
                }
                if (xMovePawn > 1) {
                    return false
                }
                if (xMovePawn === 1 && deltaY === 1) {
                    return (board[toIndex[0]][toIndex[1]] !== 0)
                }
                if (deltaY === 1) {
                    return (board[toIndex[0]][toIndex[1]] === 0)
                }
                if (Number(fromIndex[0]) === 6 && deltaY === 2 && xMovePawn === 0) {
                    return (board[Number(toIndex[0])+1][toIndex[1]] === 0 && board[toIndex[0]][toIndex[1]] === 0)
                }
                return false
            case 2:
                //rook, can move any amount in a straight line
                //One and only one of deltaX/deltaY must be 0
                if (deltaX !== 0 && deltaY !== 0) {
                    return false
                }
                let distance = deltaX + deltaY;
                for (let i = 1; i < Math.abs(distance); i++) {
                    let xOffset = i;
                    let yOffset = i;
                    if (deltaX === 0) {
                        xOffset = 0;
                    } else {
                        if (deltaX < 0) {
                            xOffset = -i;
                        }
                    }
                    if (deltaY === 0) {
                        yOffset = 0;
                    } else {
                        if (deltaY < 0) {
                            yOffset = -i;
                        }
                    }
                    if (board[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
                        return false
                    }
                }
                return true;
            case 3: 
                //knight, moves 2, turns, moves 1
                //deltax +- 2 and deltay +- 1 OR deltax +- 1 and deltay +- 2
                let xMoveKnight = Math.abs(deltaX);
                let yMoveKnight = Math.abs(deltaY);
                return ((xMoveKnight === 2 && yMoveKnight === 1) || (xMoveKnight === 1 && yMoveKnight === 2))
            case 4:
                //bishop, moves diagonal
                let xMoveBishop = Math.abs(deltaX);
                let yMoveBishop = Math.abs(deltaY);
                if (xMoveBishop !== yMoveBishop) {
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
                    if (deltaX === 0) {
                        xOffset = 0;
                    }
                    if (deltaY === 0) {
                        yOffset = 0;
                    }
                    if (board[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
                        return false
                    }
                }
                return true
            case 5:
                //queen, moves like rook or bishop
                let xMoveQueen = Math.abs(deltaX);
                let yMoveQueen = Math.abs(deltaY);
                if (xMoveQueen !== yMoveQueen && deltaX !== 0 && deltaY !== 0) {
                    return false
                }
                let queenDistance = xMoveQueen;
                if (xMoveQueen === 0 || yMoveQueen === 0) {
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
                    if (deltaX === 0) {
                        xOffset = 0;
                    }
                    if (deltaY === 0) {
                        yOffset = 0;
                    }
                    if (board[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
                        return false
                    }
                }
                return true
            case 6:
                //king, moves anywhere within 1 tile
                let xMoveKing = Math.abs(deltaX);
                let yMoveKing = Math.abs(deltaY);
                if (deltaX === 2 && yMoveKing === 0) {
                    return (specialConditions[0] && (board[toIndex[0]][Number(toIndex[1])+1] === 0))
                }
                if (deltaX === -2 && yMoveKing === 0) {
                    return (specialConditions[1] && (board[toIndex[0]][Number(toIndex[1])-1] === 0))
                }
                return (xMoveKing < 2 && yMoveKing < 2)
            default:
                console.log("not a recognized piece");
        }
    }

    function dragPiece(e){
        e.dataTransfer.setData("fromIndex", e.target.parentElement.id);
        activateTile(e.target.parentElement.id, true);
        e.target.style = "transform: translate(0,0);";
        e.dataTransfer.setDragImage(e.target, e.target.width/2,e.target.height/2);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    function activateTile(tileID, isDrag) {      
        for (let i = 0; i < curPossibleMoves.length; i++) {
            if (curPossibleMoves[i].parentElement) {
                curPossibleMoves[i].parentElement.removeChild(curPossibleMoves[i]);
            }
        }
        if (String(tileID) !== ""){
            let curTile = document.getElementById(tileID);
            let sameTile = curTile === curHighlighted[0];
            var colorChange;
            if ((Math.floor(tileID / 10) % 2 === 1) !== (tileID % 2 === 1)) {
                //white
                colorChange = "rgb(244,246,142)";
            } else {
                //green
                colorChange = "rgb(184,202,80)";
            }
            if (sameTile && curTile.style.backgroundColor !== "" && !isDrag) {
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
            if (colorChange !== "") {
                for (let i = 0; i < curBoard.length; i++) {
                    for (let j = 0; j < curBoard.length; j++) {
                        if (isValidMove(curBoard[tileID[0]][tileID[1]], tileID, String(i)+j, playerColor, curBoard)) {
                            if (!kingTrouble(curBoard[tileID[0]][tileID[1]], tileID, String(i)+j, playerColor, curBoard)) {
                                let parentNode = document.getElementById(String(i)+j);
                                let smallCircle = document.createElement("div");
                                if (document.getElementById(String(i)+j).children[0].id === "piece") {
                                    smallCircle.style.height = parentNode.offsetHeight + "px";
                                    smallCircle.style.width = parentNode.offsetWidth + "px";
                                    smallCircle.style.left = parentNode.offsetLeft + "px";
                                    smallCircle.style.top = parentNode.offsetTop + "px";
                                    smallCircle.style.border = "8px solid black";
                                    smallCircle.style.background = "rgba(0,0,0,0.2)";
                                } else {
                                    smallCircle.style.height = parentNode.offsetHeight/3 + "px";
                                    smallCircle.style.width = parentNode.offsetWidth/3 + "px";
                                    smallCircle.style.left = parentNode.offsetLeft + parentNode.offsetHeight/3 + "px";
                                    smallCircle.style.top = parentNode.offsetTop + parentNode.offsetWidth/3 + "px";
                                    smallCircle.style.backgroundColor = "black";
                                }
                                smallCircle.id = "possibleSmallCircle";
                                smallCircle.className = "possibleSmallCircle";
                                document.getElementById(String(i)+j).appendChild(smallCircle);
                                curPossibleMoves.push(smallCircle);
                            }
                        }
                    }
                }
            }
        }
    }

    //Check for check mate
    function mateCheck(curColor, board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] !== 0) {
                    if (board[i][j].player === curColor){
                        for (let a = 0; a < 8; a++) {
                            for (let b = 0; b < 8; b++) {
                                if (isValidMove(board[i][j], String(i)+j, String(a)+b, curColor, board)) {
                                    if (!kingTrouble(board[i][j], String(i)+j, String(a)+b, curColor, board)) {
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return true
    }

    //Ends the game
    function endGameCheckMate(winningColor, board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] !== 0) {
                    if (board[i][j].piece === 6) {
                        if (board[i][j].player !== winningColor) {
                            let loseKing = document.getElementById(String(i)+j);
                            let loseCircle = document.createElement("div");
                            loseCircle.id = "loseCircle";
                            loseCircle.innerHTML = "#";
                            loseCircle.style.left = loseKing.offsetLeft + "px";
                            loseCircle.style.top = loseKing.offsetTop + "px";
                            loseCircle.style.height = boxHeight/24 + "px";
                            loseCircle.style.width = boxWidth/24 + "px";
                            if (winningColor === 0) {
                                //loser is black
                                loseCircle.style.border = "1px solid white";
                                loseCircle.style.backgroundColor = "black";
                                loseCircle.style.color = "white";
                            } else {
                                //loser is white
                                loseCircle.style.border = "1px solid black";
                                loseCircle.style.backgroundColor = "white";
                                loseCircle.style.color = "black";
                            }
                            loseKing.appendChild(loseCircle);
                        }
                    }
                }
            }
        }
    }

    //evaluation bar number
    function getEval() {
        if (mateCheck(playerColor, curBoard)) {
            endGameCheckMate(Math.abs(playerColor-1), curBoard);
            return 50000;
        }
        if (mateCheck(Math.abs(playerColor-1), curBoard)) {
            endGameCheckMate(playerColor, curBoard);
            return -50000;
        }
        return curEval;
    }

    function textEval() {
        let curEval = getEval();
        if (Math.abs(curEval) !== 50000) {
            return Math.abs(curEval)/100;
        }
        return "Check Mate";
    }

    return(<div>
        <div className="chessBoard" id="chessBoard">
        <div className="chessBoardTiles" style={{gridTemplateColumns: `repeat(8, ${boxWidth/8}px)`, gridTemplateRows: `repeat(8, ${boxHeight/8}px)`}}>
            {curBoard.map((row, index) => (
                row.map((tile, innerIndex) => (
                    <div key={index+innerIndex} id={String(index)+innerIndex}>
                        {getImage(tile)}
                    </div>
                ))
            ))}
        </div>
        <div className="evalBar" style={{width: `${boxWidth/16}px`, height: `${boxHeight}px`, transform: `translate(${-4.3*boxWidth/8}px,${-boxHeight}px)`, color: `${playerColor === 1 ? "black" : "white"}`, background: `linear-gradient(to top,  ${playerColor === 1 ? "dimgray" : "white"} 0%, ${playerColor === 1 ? "dimgray" : "white"} ${50 - getEval()/50}%, ${playerColor === 1 ? "white" : "dimgray"} ${50 - getEval()/50}%, ${playerColor === 1 ? "white" : "dimgray"} 100%)`}}><span>{textEval()}</span></div>
    </div>
    </div>
    );
};

export default Chess;