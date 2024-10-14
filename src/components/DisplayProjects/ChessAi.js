const ChessAi = num => {
        for (let i = 0; i < 100000; i++) {
            for (let j = 0; j < 100000; j++) {
                num = num + 1;
            }
        }
        return num;
};

export default ChessAi;