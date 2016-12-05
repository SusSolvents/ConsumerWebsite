
var getEuclidianDistance = function(vector1, vector2) {    
    var sum = 0;
    for (var i = 0; i < vector1.length; i++) {
        sum += (vector1[i] - vector2[i]) * (vector1[i] - vector2[i]);
    }

    return Math.sqrt(sum);
}


var buildDistanceMatrix = function() {
    var matrix = null;

    var init = function () {
        this.matrix = [];
    }

    var addRowWithDistances = function (distances) {
        this.matrix.push(distances);
    }

    var getMatrix = function() {
        return this.matrix;
    }

    return {
        init: init,
        addRowWithDistances: addRowWithDistances,
        getMatrix: getMatrix
    };
}();