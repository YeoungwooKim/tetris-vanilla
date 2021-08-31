class Piece {
    x;
    y;
    color;
    shape;
    shapeNo;
    ctx;
    status;

    constructor(ctx) {
        this.ctx = ctx;
        this.spawn();
    }
    spawn() {
        this.shape = shapeGen();
        this.color = colorSel(this.shape);
        this.x = Math.floor((Math.random() * (9 - 3)) + 1);
        this.y = 0;
        for (var i = 1; i < SHAPES.length; i++) {
            if (this.shape == SHAPES[i]) {
                this.shapeNo = i;
            }
        }
        this.status = 0;
    }
}
function xlen(piece) {
    if (piece.shapeNo == 5 || piece.shapeNo == 7) {
        if (piece.status == 0 || piece.status == 180) {
            return 3;
        }
        return 2;
    } else {
        var tmpShape = piece.shape;
        var xArr = [];
        var xSum = 0;
        for (var c = 0; c < tmpShape.length; c++) {
            xSum = 0;
            for (var r = 0; r < tmpShape[c].length; r++) {
                xSum += tmpShape[c][r];
            }
            xArr.push(xSum / piece.shapeNo);
        }
        return Math.max.apply(null, xArr);
    }
}


function ylen(piece) {
    if (piece.shapeNo == 5 || piece.shapeNo == 7) {
        if (piece.status == 0 || piece.status == 180) {
            return 2;
        }
        return 3;
    } else {
        var tmpShape = piece.shape;
        var yArr = [];
        var ySum = 0;
        for (var c = 0; c < tmpShape.length; c++) {
            ySum = 0;
            for (var r = 0; r < tmpShape[c].length; r++) {
                ySum += tmpShape[r][c];
            }
            yArr.push(ySum / piece.shapeNo);
        }
        return Math.max.apply(null, yArr);
    }
}


function colorSel(params) {
    for (var i = 0; i < params.length; i++) {
        for (var q = 0; q < params[i].length; q++) {
            if (params[i][q] != 0) {
                //console.log(COLORS[params[i][q]]);
                return COLORS[params[i][q]];
            }
        }
    }
}

function shapeGen() {
    var num = Math.floor((Math.random() * (8 - 1)) + 1);
    var shape;
    if (num == 1) {
        shape = SHAPES[1];
    } else if (num == 2) {
        shape = SHAPES[2];
    } else if (num == 3) {
        shape = SHAPES[3];
    } else if (num == 4) {
        shape = SHAPES[4];
    } else if (num == 5) {
        shape = SHAPES[5];
    } else if (num == 6) {
        shape = SHAPES[6];
    } else if (num == 7) {
        shape = SHAPES[7];
    }
    //console.log("piece is newly generated..", shape);
    return shape;
}
