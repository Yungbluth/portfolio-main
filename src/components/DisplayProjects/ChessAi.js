import Chess from "./Chess"
/*
Value of pieces:
Pawn: 100
Knight: 320
Bishop: 330
Rook: 500
Queen: 900
King: 20000

Explore possible moves using Minimax algo
Optimize with Alpha-beta pruning
Improve evaluation based on positioning of pieces

Quiescence Search?
Null Move Pruning?
Extra Multi Threading for searching?
*/

const ChessAi = (curBoard, playerColor) => {

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

    /*
    function makeMove(fromIndex, toIndex) {
        curBoard[toIndex[0]][toIndex[1]] = curBoard[fromIndex[0]][fromIndex[1]];
        curBoard[fromIndex[0]][fromIndex[1]] = 0;
    }*/

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

    function getPossibleMoves(possibleBoard, possiblePlayer) {
        let possibleMovesBoard = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (possibleBoard[i][j] !== 0) {
                    if (possibleBoard[i][j].player === possiblePlayer) {
                        for (let a = 0; a < 8; a++) {
                            for (let b = 0; b < 8; b++) {
                                if (isValidMove(possibleBoard[i][j], String(i)+j, String(a)+b, possibleBoard)) {
                                    let newPossibleBoard = [];
                                    for (let h = 0; h < 8; h++) {
                                        newPossibleBoard[h] = possibleBoard[h].slice();
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
        return possibleMovesBoard;
    }

    function alphaBetaMax(alpha, beta, depthleft, possibleBoard) {
        if ( depthleft === 0 ) {return evalBoardState(possibleBoard)};
        let curMoves = getPossibleMoves(possibleBoard, aiColor);
        var bestMove;
        for (let i = 0; i < curMoves.length; i++) {
           let score = alphaBetaMin( alpha, beta, depthleft - 1, curMoves[i]);
           if( score >= beta )
              return beta;   // fail hard beta-cutoff
           if( score > alpha ){
              alpha = score; // alpha acts like max in MiniMax
              bestMove = curMoves[i];
           }   
        }
        if (depthleft === 4) {
            return bestMove;
        }
        return alpha;
     }
      
     function alphaBetaMin(alpha, beta, depthleft, possibleBoard) {
        if ( depthleft === 0 ) {return -evalBoardState(possibleBoard)};
        let curMoves = getPossibleMoves(possibleBoard, playerColor);
        for (let i = 0; i < curMoves.length; i++) {
           let score = alphaBetaMax( alpha, beta, depthleft - 1, curMoves[i]);
           if( score <= alpha )
              return alpha; // fail hard alpha-cutoff
           if( score < beta )
              beta = score; // beta acts like min in MiniMax
        }
        return beta;
     }

    function isValidMove(piece, fromIndex, toIndex, tempBoard) {
        if (fromIndex === toIndex) {
            return false
        }
        /*
        if (piece.player !== curColor) {
            //not your piece!
            return false
        }*/

        if (tempBoard[toIndex[0]][toIndex[1]] !== 0) {
            if (tempBoard[toIndex[0]][toIndex[1]].player === tempBoard[fromIndex[0]][fromIndex[1]].player) {
                return false;
            }
        }
        
        //let deltaX = fromIndex[1] - toIndex[1];
        //let deltaY = fromIndex[0] - toIndex[0];
        let deltaX = toIndex[1] - fromIndex[1];
        let deltaY = toIndex[0] - fromIndex[0];
        
        switch(piece.piece) {
            case 1: 
                //pawn, can move 1 forward, or 2 if it is on the 7th row
                if (deltaX !== 0) {
                    return false
                }
                if (deltaY === 1) {
                    return true
                }
                if (Number(fromIndex[0]) === 1 && deltaY === 2) {
                    return (tempBoard[Number(toIndex[0])+1][toIndex[1]] === 0)
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
                return (xMoveKing < 2 && yMoveKing < 2)
            default:
                console.log("not a recognized piece");
        }
    }
    //makeMove("01", "20");
    let score = alphaBetaMax(-999999, 999999, 4, curBoard);
    //let score = getPossibleMoves(curBoard, aiColor);
    return score;
};

export default ChessAi;