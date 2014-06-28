/**
 * Created by monoless on 2014. 6. 28..
 */
var Lifegame = {
    'width':0,
    'height':0,
    'totalSize':0,
    'generation':1,
    'cells':{},
    'seed':0.2,
    'wrapper':null,
    'screen':null,
    'initialize':function(){
        if ( this.wrapper ) {
            this.width = this.wrapper.clientWidth;
            this.height = this.wrapper.clientHeight;
            this.totalSize = this.width * this.height;
            this.screen = this.wrapper.getContext('2d');
            this.screen.canvas.width = this.width;
            this.screen.canvas.height = this.height;
        }
    },
    'firstGeneration':function(){
        var newCells = [];
        var position = [];
        for ( var i = 0; i < this.totalSize; i++ ) {
            if ( Math.random() < this.seed ) {
                position = this.intToPosition(i);
                this.drawDot(position[0], position[1]);
                newCells[i] = true;
            }
        }

        this.cells = newCells;
    },
    'nextGeneration':function(){
        var newCells = [];
        var currentAlive = false;
        var neighborCount = 0;
        var position;
        for ( var i = 0; i < this.totalSize; i++ ) {
            position = this.intToPosition(i);
            currentAlive = this.cells[i];
            neighborCount = this.neighborCount(position[0], position[1]);

            if ( currentAlive == true ) {
                if ( neighborCount < 2 || neighborCount > 3 ) {
                    this.eraseDot(position[0], position[1]);
                } else {
                    newCells[i] = true;
                }
            } else {
                if ( neighborCount == 3 ) {
                    this.drawDot(position[0], position[1]);
                    newCells[i] = true;
                }
            }
        }

        this.cells = newCells;
        this.generation++;
        window.setInterval(function(){
            Lifegame.nextGeneration();
        }, 100);
    },
    'neighborCount':function(x, y){
        var result = 0;
        var c = {'t': false, 'b': false, 'l': false, 'r': false};
        if ((x - 1) >= 0)           c.l = true;
        if ((x + 1) <= this.width)  c.r = true;
        if ((y - 1) >= 0)           c.t = true;
        if ((y + 1) <= this.height) c.b = true;

        if (c.t && c.l && this.cells[this.positionToInt(x - 1, y - 1)])  result++;
        if (c.t && this.cells[this.positionToInt(x, y - 1)])             result++;
        if (c.t && c.r && this.cells[this.positionToInt(x + 1, y - 1)])  result++;
        if (c.l && this.cells[this.positionToInt(x - 1, y)])             result++;
        if (c.r && this.cells[this.positionToInt(x + 1, y)])             result++;
        if (c.b && c.l && this.cells[this.positionToInt(x - 1, y + 1)])  result++;
        if (c.b && this.cells[this.positionToInt(x, y + 1)])             result++;
        if (c.b && c.r && this.cells[this.positionToInt(x + 1, y + 1)])  result++;
        return result;
    },
    'drawDot':function(x, y){
        this.screen.fillStyle = '#00ff00';
        this.screen.fillRect(x, y, 1, 1);
    },
    'eraseDot':function(x, y){
        this.screen.fillStyle = '#000000';
        this.screen.fillRect(x, y, 1, 1);
    },
    'positionToInt':function(x, y){
        return (this.width * y) + x;
    },
    'intToPosition':function(position){
        var result = [0, 0];
        if ( position > 0 ) {
            result[1] = Math.floor(position / this.width);
            result[0] = position - (result[1] * this.width);
        }
        return result;
    }
};