
/*
Handles the logic of Ai chess bot making a move

Value of pieces:
Pawn: 100
Knight: 320
Bishop: 330
Rook: 500
Queen: 900
King: 20000
*/

const ChessAi = (curBoard, playerColor, specialConditions) => {

    let depth = 4;

    const pawnPositionTable = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const knightPositionTable = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    const bishopPositionTable = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    const rookPositionTable = [
        [0,  0,  0,  5,  5,  0,  0,  0],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const queenPositionTable = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    const kingPositionTable = [
        [20, 30, 10,  0,  0, 10, 30, 20],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30]
    ];

    let aiColor = Math.abs(playerColor-1);

    function evalBoardState(possibleBoard) {
        let evalNum = 0;
        for (let i = 0; i < possibleBoard.length; i++) {
            for (let j = 0; j < possibleBoard[i].length; j++) {
                if (possibleBoard[i][j] !== 0) {
                    var curNum;
                    let indexOne = i;
                    let indexTwo = j;
                    if (possibleBoard[i][j].player === aiColor) {
                        curNum = 1;
                    } else {
                        curNum = -1;
                        indexOne = 7-i;
                        indexTwo = 7-j;
                    }
                    switch(possibleBoard[i][j].piece) {
                        case 1:
                            evalNum = evalNum + curNum*100 + curNum*pawnPositionTable[indexOne][indexTwo];
                            break;
                        case 2:
                            evalNum = evalNum + curNum*500 + curNum*rookPositionTable[indexOne][indexTwo];
                            break;
                        case 3:
                            evalNum = evalNum + curNum*320 + curNum*knightPositionTable[indexOne][indexTwo];
                            break;
                        case 4:
                            evalNum = evalNum + curNum*330 + curNum*bishopPositionTable[indexOne][indexTwo];
                            break;
                        case 5:
                            evalNum = evalNum + curNum*900 + curNum*queenPositionTable[indexOne][indexTwo];
                            break;
                        case 6:
                            evalNum = evalNum + curNum*20000 + curNum*kingPositionTable[indexOne][indexTwo];
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return evalNum;
    }

    //With a board and a player, returns an array of all possible moves that player can play
    function getPossibleMoves(possibleBoard, possiblePlayer) {
        let possibleMovesBoard = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (possibleBoard[i][j] !== 0) {
                    if (possibleBoard[i][j].player === possiblePlayer) {
                        for (let a = 0; a < 8; a++) {
                            for (let b = 0; b < 8; b++) {
                                if (isValidMove(possibleBoard[i][j], String(i)+j, String(a)+b, possibleBoard)) {
                                    if (possiblePlayer === aiColor && !kingTrouble(possibleBoard[i][j], String(i)+j, String(a)+b, possiblePlayer, possibleBoard)) {
                                        
                                        let newPossibleBoard = [];
                                        for (let h = 0; h < 8; h++) {
                                            newPossibleBoard[h] = possibleBoard[h].slice();
                                        }
                                        if (newPossibleBoard[i][j].piece === 6) {
                                            let deltaX = b - j;
                                            if (deltaX === 2) {
                                                newPossibleBoard[0][b-1] = newPossibleBoard[0][7];
                                                newPossibleBoard[0][7] = 0;
                                            }
                                            if (deltaX === -2) {
                                                newPossibleBoard[0][b+1] = newPossibleBoard[0][0];
                                                newPossibleBoard[0][0] = 0;
                                            }
                                        }
                                        if (newPossibleBoard[i][j].piece === 1 && (a === 0 || a === 7)) {
                                            newPossibleBoard[i][j] = {player: possiblePlayer, piece: 5};
                                        }
                                        newPossibleBoard[a][b] = newPossibleBoard[i][j];
                                        newPossibleBoard[i][j] = 0;
                                        possibleMovesBoard.push(newPossibleBoard);
                                        
                                    } else {
                                        let newPossibleBoard = [];
                                        for (let h = 0; h < 8; h++) {
                                            newPossibleBoard[h] = possibleBoard[h].slice();
                                        }
                                        if (newPossibleBoard[i][j].piece === 6) {
                                            let deltaX = b - j;
                                            if (deltaX === 2) {
                                                newPossibleBoard[0][b-1] = newPossibleBoard[0][7];
                                                newPossibleBoard[0][7] = 0;
                                            }
                                            if (deltaX === -2) {
                                                newPossibleBoard[0][b+1] = newPossibleBoard[0][0];
                                                newPossibleBoard[0][0] = 0;
                                            }
                                        }
                                        if (newPossibleBoard[i][j].piece === 1 && (a === 0 || a === 7)) {
                                            newPossibleBoard[i][j] = {player: possiblePlayer, piece: 5};
                                        }
                                        newPossibleBoard[a][b] = newPossibleBoard[i][j];
                                        newPossibleBoard[i][j] = 0;
                                        possibleMovesBoard.push(newPossibleBoard);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return possibleMovesBoard;
    }

    //Returns boolean if king is in check
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
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (tempBoard[i][j] !== 0) {
                    if (tempBoard[i][j].piece === 6 && tempBoard[i][j].player === color) {
                        kingPos = String(i) + j;
                    }
                }
            }
        }

        if (kingPos === 0) {
            return false
        }
        let oppColor = Math.abs(color-1);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (tempBoard[i][j] !== 0) {
                    if (tempBoard[i][j].player === oppColor) {
                        if (isValidMove(tempBoard[i][j], String(i)+j, kingPos, tempBoard)) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    /*
    Alpha-beta pruning algo. Looks for lines with the best outcomes for ai and least good outcomes for player
    passes lines have a worse worst case scenario
    For example: If one move involves a worst case scenario of an even evaluation, when we look at another move and find we lose a rook we can ignore the rest of that path. This even evalation is our lower bound.
    We also need to have a higher bound because we assume the player is also playing the best possible moves in response to the ai. Ignore all paths where the player is not playing the best move.
    */
    function alphaBetaMax(alpha, beta, depthleft, possibleBoard) {
        if ( depthleft === 0 ) {return evalBoardState(possibleBoard)};
        let curMoves = getPossibleMoves(possibleBoard, aiColor);
        var bestMove;
        for (let i = 0; i < curMoves.length; i++) {
           let score = alphaBetaMin( alpha, beta, depthleft - 1, curMoves[i]);
           if( score >= beta ){
                if (depthleft === depth) {
                    return (bestMove === undefined ? curMoves[i] : bestMove)
                }
              return beta;   // fail hard beta-cutoff
            }
           if( score > alpha ){
              alpha = score; // alpha acts like max in MiniMax
              bestMove = curMoves[i];
           }   
        }
        if (depthleft === depth) {
            return bestMove;
        }
        return alpha;
     }
      
     function alphaBetaMin(alpha, beta, depthleft, possibleBoard) {
        if ( depthleft === 0 ) {return -evalBoardState(possibleBoard)};
        let curMoves = getPossibleMoves(possibleBoard, playerColor);
        var bestMove;
        for (let i = 0; i < curMoves.length; i++) {
           let score = alphaBetaMax( alpha, beta, depthleft - 1, curMoves[i]);
           if( score <= alpha )
              return alpha; // fail hard alpha-cutoff
           if( score < beta )
              beta = score; // beta acts like min in MiniMax
            bestMove = curMoves[i];
        }
        if (depthleft === depth) {
            return bestMove;
        }
        return beta;
     }

    function isValidMove(piece, fromIndex, toIndex, tempBoard) {
        if (fromIndex === toIndex) {
            return false
        }

        if (tempBoard[toIndex[0]][toIndex[1]] !== 0) {
            if (tempBoard[toIndex[0]][toIndex[1]].player === tempBoard[fromIndex[0]][fromIndex[1]].player) {
                return false;
            }
        }
        
        let deltaX = toIndex[1] - fromIndex[1];
        let deltaY = toIndex[0] - fromIndex[0];
        
        switch(piece.piece) {
            case 1: 
                //pawn, can move 1 forward, or 2 if it is on the 7th row
                let xMovePawn = Math.abs(deltaX);
                if (piece.player !== aiColor) {
                    deltaY = -deltaY;
                }
                if (xMovePawn > 1) {
                    return false
                }
                if (xMovePawn === 1 && deltaY === 1) {
                    return (tempBoard[toIndex[0]][toIndex[1]] !== 0)
                }
                if (deltaY === 1) {
                    return (tempBoard[toIndex[0]][toIndex[1]] === 0)
                }
                if (piece.player === aiColor){
                    if (Number(fromIndex[0]) === 1 && deltaY === 2 && xMovePawn === 0) {
                        return (tempBoard[Number(toIndex[0])-1][toIndex[1]] === 0 && tempBoard[toIndex[0]][toIndex[1]] === 0)
                    }
                } else {
                    if (Number(fromIndex[0]) === 6 && deltaY === 2 && xMovePawn === 0) {
                        return (tempBoard[Number(toIndex[0])+1][toIndex[1]] === 0 && tempBoard[toIndex[0]][toIndex[1]] === 0)
                    }
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
                        if (deltaX > 0) {
                            xOffset = -i;
                        }
                    }
                    
                    if (deltaY === 0) {
                        yOffset = 0;
                    } else {
                        if (deltaY > 0) {
                            yOffset = -i;
                        }
                    }
                    if (tempBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
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
                    if (deltaX > 0) {
                        xOffset = -i;
                    }
                    if (deltaY > 0) {
                        yOffset = -i;
                    }
                    if (deltaX === 0) {
                        xOffset = 0;
                    }
                    if (deltaY === 0) {
                        yOffset = 0;
                    }
                    if (tempBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
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
                    if (deltaX > 0) {
                        xOffset = -i;
                    }
                    if (deltaY > 0) {
                        yOffset = -i;
                    }
                    if (deltaX === 0) {
                        xOffset = 0;
                    }
                    if (deltaY === 0) {
                        yOffset = 0;
                    }
                    if (tempBoard[Number(toIndex[0])+yOffset][Number(toIndex[1])+xOffset] !== 0) {
                        return false
                    }
                }
                return true
            case 6:
                //king, moves anywhere within 1 tile
                let xMoveKing = Math.abs(deltaX);
                let yMoveKing = Math.abs(deltaY);
                var conditionsOffset;
                piece.player === aiColor ? conditionsOffset = 2 : conditionsOffset = 0;
                if (deltaX === 2 && yMoveKing === 0) {
                    return (specialConditions[0 + conditionsOffset] && (curBoard[toIndex[0]][Number(toIndex[1])-1] === 0) && curBoard[toIndex[0]][toIndex[1]] === 0)
                }
                if (deltaX === -2 && yMoveKing === 0) {
                    return (specialConditions[1 + conditionsOffset] && (curBoard[toIndex[0]][Number(toIndex[1])+1] === 0) && curBoard[toIndex[0]][toIndex[1]] === 0)
                }
                return (xMoveKing < 2 && yMoveKing < 2)
            default:
                console.log("not a recognized piece");
        }
    }

    //Get the best move the ai finds and return that back to the main thread
    let bestMove = alphaBetaMax(-999999, 999999, depth, curBoard);

    if (!Array.isArray(bestMove)) {
        bestMove = getPossibleMoves(curBoard, aiColor)[0];
    }
    return [bestMove, evalBoardState(bestMove)];
};

export default ChessAi;