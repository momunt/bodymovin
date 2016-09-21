function CVCompElement(data, comp,globalData){
    this._parent.constructor.call(this,data, comp,globalData);
    var compGlobalData = {};
    for(var s in globalData){
        if(globalData.hasOwnProperty(s)){
            compGlobalData[s] = globalData[s];
        }
    }
    compGlobalData.renderer = this;
    compGlobalData.compHeight = this.data.h;
    compGlobalData.compWidth = this.data.w;
    this.renderConfig = {
        clearCanvas: true
    };
    this.contextData = {
        saved : Array.apply(null,{length:15}),
        savedOp: Array.apply(null,{length:15}),
        cArrPos : 0,
        cTr : new Matrix(),
        cO : 1
    };
    var i, len = 15;
    for(i=0;i<len;i+=1){
        this.contextData.saved[i] = Array.apply(null,{length:16});
    }
    this.transformMat = new Matrix();
    this.parentGlobalData = this.globalData;
    var cv = document.createElement('canvas');
    //document.body.appendChild(cv);
    compGlobalData.canvasContext = cv.getContext('2d');
    this.canvasContext = compGlobalData.canvasContext;
    cv.width = this.data.w;
    cv.height = this.data.h;
    this.canvas = cv;
    this.globalData = compGlobalData;
    this.layers = data.layers;
    if(this.data.tm){
        this.tm = PropertyFactory.getProp(this,this.data.tm,0,globalData.frameRate,this.dynamicProperties);
    }
}
createElement(CVBaseElement, CVCompElement);

CVCompElement.prototype.ctxTransform = CanvasRenderer.prototype.ctxTransform;
CVCompElement.prototype.ctxOpacity = CanvasRenderer.prototype.ctxOpacity;
CVCompElement.prototype.save = CanvasRenderer.prototype.save;
CVCompElement.prototype.restore = CanvasRenderer.prototype.restore;
CVCompElement.prototype.reset =  function(){
    this.contextData.cArrPos = 0;
    this.contextData.cTr.reset();
    this.contextData.cO = 1;
};
CVCompElement.prototype.resize = function(transformCanvas){
    var maxScale = Math.max(transformCanvas.sx,transformCanvas.sy);
    this.canvas.width = this.data.w*maxScale;
    this.canvas.height = this.data.h*maxScale;
    this.transformCanvas = {
        sc:maxScale,
        w:this.data.w*maxScale,
        h:this.data.h*maxScale,
        props:[maxScale,0,0,0,0,maxScale,0,0,0,0,1,0,0,0,0,1]
    }
    var i,len = this.elements.length;
    for( i = 0; i < len; i+=1 ){
        if(this.elements[i].data.ty === 0){
            this.elements[i].resize(transformCanvas);
        }
    }
};

CVCompElement.prototype.prepareFrame = function(num){
    this.globalData.frameId = this.parentGlobalData.frameId;
    this.globalData.mdf = false;
    this._parent.prepareFrame.call(this,num);
    if(this.isVisible===false){
        return;
    }
    var timeRemapped = num;
    if(this.tm){
        timeRemapped = this.tm.v;
        if(timeRemapped === this.data.op){
            timeRemapped = this.data.op - 1;
        }
    }
    this.renderedFrame = timeRemapped/this.data.sr;
    var i,len = this.elements.length;
    for( i = 0; i < len; i+=1 ){
        this.elements[i].prepareFrame(timeRemapped/this.data.sr - this.layers[i].st);
        if(this.elements[i].data.ty === 0 && this.elements[i].globalData.mdf){
            this.globalData.mdf = true;
        }
    }
    if(this.globalData.mdf){
        this.canvasContext.clearRect(0, 0, this.data.w, this.data.h);
        this.ctxTransform(this.transformCanvas.props);
    }
};

CVCompElement.prototype.renderFrame = function(parentMatrix){
    // console.log("CVCompElement inside renderFrame");
    if(this._parent.renderFrame.call(this,parentMatrix)===false){
        return;
    }
    if(this.globalData.mdf){
        var i,len = this.layers.length;
        for( i = len - 1; i >= 0; i -= 1 ){
            // console.log(" - rendering el " + i);
            this.elements[i].renderFrame();
        }
    }
    // console.log("CVCompElement done with layers");

    if(this.data.hasMask){
        this.globalData.renderer.restore(true);
    }
    if(this.firstFrame){
        this.firstFrame = false;
    }

    this.parentGlobalData.renderer.save();
    this.parentGlobalData.renderer.ctxTransform(this.finalTransform.mat.props);
    this.parentGlobalData.renderer.ctxOpacity(this.finalTransform.opacity);

    // console.log("at " + this.parentGlobalData.renderer.canvasContext.drawImage);
    // console.log(this.parentGlobalData.renderer.canvasContext);
    // console.log(this.canvas);
    // console.log(this.canvas.toDataURL('png'));
    
    // UNCOMMENT:
    // console.log(this.canvas);
    this.parentGlobalData.renderer.canvasContext.drawImage(this.canvas,0,0,this.data.w,this.data.h);
    
    this.parentGlobalData.renderer.restore();

    if(this.globalData.mdf){
        this.reset();
    }

    console.log("CVCompElement done renderFrame");
};

CVCompElement.prototype.setElements = function(elems){
    this.elements = elems;
};

CVCompElement.prototype.getElements = function(){
    return this.elements;
};

CVCompElement.prototype.destroy = function(){
    var i,len = this.layers.length;
    for( i = len - 1; i >= 0; i -= 1 ){
        this.elements[i].destroy();
    }
    this.layers = null;
    this.elements = null;
    this._parent.destroy.call();
};