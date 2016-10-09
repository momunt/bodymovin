function CVVideoElement(data, comp,globalData){
    this.assetData = globalData.getAssetData(data.refId);
    this._parent.constructor.call(this,data, comp,globalData);
    this.globalData.addPendingElement();
}
createElement(CVBaseElement, CVVideoElement);

CVVideoElement.prototype.createElements = function(){

    var imageLoaded = function(){
        // this.globalData.elementLoaded();

        var widthCrop = 0,
            heightCrop = 0;
       
        if(this.assetData.w !== this.img.width || this.assetData.h !== this.img.height){

            var imgW = this.img.width;
            var imgH = this.img.height;
            var imgRel = imgW / imgH;
            var canvasRel = this.assetData.w/this.assetData.h;
            
            if(imgRel>canvasRel){
                heightCrop = imgH;
                widthCrop = heightCrop*canvasRel;
            } else {
                widthCrop = imgW;
                heightCrop = widthCrop/canvasRel;
            }
            
        }

        this.canvas.getContext('2d').drawImage(this.img,(imgW-widthCrop)/2,(imgH-heightCrop)/2,widthCrop,heightCrop,0,0,this.assetData.w,this.assetData.h);


    }.bind(this);

    var imageFailed = function(){
        this.failed = true;
        this.globalData.elementLoaded();
    }.bind(this); 

    this.img = new Image();
    this.img.addEventListener('load', imageLoaded, false);
    this.img.addEventListener('error', imageFailed, false);


    this.canvas = document.createElement('canvas');
    this.canvas.width = this.assetData.w;
    this.canvas.height = this.assetData.h;


    this._parent.createElements.call(this);

};

CVVideoElement.prototype.renderFrame = function(parentMatrix){

    if(this._parent.renderFrame.call(this,parentMatrix)===false){
        return;
    }
    var ctx = this.canvasContext;
    this.globalData.renderer.save();
    var finalMat = this.finalTransform.mat.props;
    this.globalData.renderer.ctxTransform(finalMat);
    this.globalData.renderer.ctxOpacity(this.finalTransform.opacity); 

    var assetPath = this.globalData.getAssetsPathForFrame(this.assetData, this.globalData.renderer.currentFrameNum+1);
    this.img.src = assetPath;

    ctx.drawImage(this.canvas,0,0);

    this.globalData.renderer.restore(this.data.hasMask);
    if(this.firstFrame){
        this.firstFrame = false;
    }
    
};

CVVideoElement.prototype.destroy = function(){
    this.img = null;
    this._parent.destroy.call();
};