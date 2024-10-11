import React, { useState, useEffect } from "react";
import chessBoard from "./ChessImages/board.png"
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



const Chess = function ({onMountChess}) {
    let boxWidth = Math.min(document.documentElement.clientWidth * 0.8 - 60, document.documentElement.clientHeight * 0.8 - 60);
    let boxHeight = boxWidth.valueOf();

        //0 is player, 1 is ai
        /*
        pieces:
        1: pawn
        2: rook
        3: knight
        4: bishop
        5: queen
        6: king
        */

    const [curBoard, setCurBoard] = useState([[]]);
    let pieces = [["", whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing], ["", blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing]];
    //let whitePieces = ["", whitePawn, whiteRook, whiteKnight, whiteBishop, whiteQueen, whiteKing];
    //let blackPieces = ["", blackPawn, blackRook, blackKnight, blackBishop, blackQueen, blackKing];

    useEffect(() => {
        onMountChess([curBoard, setCurBoard]);
      }, [onMountChess, curBoard]);

    function setupBoard() {
        let playerColor = Math.round(Math.random());
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
        setCurBoard(freshBoard);
    }
    if (curBoard[0][0] === undefined) {
        setupBoard();
    }

    function getImage(pieceObj) {
        if (pieceObj === 0 || pieceObj === undefined) {
            return;
        }
        return(<img src={pieces[pieceObj.player][pieceObj.piece]}></img>);
    }

    //<img src={ chessBoard } alt="board not found" style={{height: boxHeight, width: boxWidth}}/>
    //<div className="piece" style={{bottom:boxHeight, left: boxWidth/8 + boxWidth/13, width:boxWidth/8, height:boxHeight/8, top: boxHeight/8}}>
    //<img src={ whitePawn } alt="white pawn not found" />
    return(<div>
        <div className="chessBoard">
        <div className="papan" style={{gridTemplateColumns: `repeat(8, ${boxWidth/8}px)`, gridTemplateRows: `repeat(8, ${boxHeight/8}px)`}}>
            {curBoard.map((row, index) => (
                row.map((tile, innerIndex) => (
                    <div key={innerIndex}>
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