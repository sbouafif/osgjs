osg.CullStack = function() {
    this._modelviewMatrixStack = [];
    this._projectionMatrixStack = [];
    this._viewportStack = [];
    this._bbCornerFar = 0;
    this._bbCornerNear = 0;
};

osg.CullStack.prototype = {
    getViewport: function () {
        if (this._viewportStack.length === 0) {
            return undefined;
        }
        return this._viewportStack[this._viewportStack.length-1];
    },
    getLookVectorLocal: function() {
        var m = this._modelviewMatrixStack[this._modelviewMatrixStack.length-1];
        return [ -m[2], -m[6], -m[10] ];
    },
    pushViewport: function (vp) {
        this._viewportStack.push(vp);
    },
    popViewport: function () {
        this._viewportStack.pop();
    },
    pushModelviewMatrix: function (matrix) {
        this._modelviewMatrixStack.push(matrix);

        var lookVector = this.getLookVectorLocal();
        this._bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);        
        this._bbCornerNear = (~this._bbCornerFar)&7;
    },
    popModelviewMatrix: function () {

        this._modelviewMatrixStack.pop();
        var lookVector;
        if (this._modelviewMatrixStack.length !== 0) {
            lookVector = this.getLookVectorLocal();
        } else {
            lookVector = [0,0,-1];
        }
        this._bbCornerFar = (lookVector[0]>=0?1:0) | (lookVector[1]>=0?2:0) | (lookVector[2]>=0?4:0);
        this._bbCornerNear = (~this._bbCornerFar)&7;

    },
    pushProjectionMatrix: function (matrix) {
        this._projectionMatrixStack.push(matrix);
    },
    popProjectionMatrix: function () {
        this._projectionMatrixStack.pop();
    }
};
