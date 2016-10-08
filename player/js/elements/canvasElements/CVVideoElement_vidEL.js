function CVVideoElement(data, comp,globalData){
    this.assetData = globalData.getAssetData(data.refId);
    this._parent.constructor.call(this,data, comp,globalData);
    this.globalData.addPendingElement();
}
createElement(CVBaseElement, CVVideoElement);

CVVideoElement.prototype.createElements = function(){
    var videoLoaded = function(){
        this.globalData.elementLoaded();
        console.log("video element loaded");

        // if(this.assetData.w !== this.img.width || this.assetData.h !== this.img.height){
            // var canvas = document.createElement('canvas');
            // canvas.width = this.assetData.w;
            // canvas.height = this.assetData.h;
            // var ctx = canvas.getContext('2d');

        //     var imgW = this.img.width;
        //     var imgH = this.img.height;
        //     var imgRel = imgW / imgH;
        //     var canvasRel = this.assetData.w/this.assetData.h;
        //     var widthCrop, heightCrop;
        //     if(imgRel>canvasRel){
        //         heightCrop = imgH;
        //         widthCrop = heightCrop*canvasRel;
        //     } else {
        //         widthCrop = imgW;
        //         heightCrop = widthCrop/canvasRel;
        //     }
        //     ctx.drawImage(this.img,(imgW-widthCrop)/2,(imgH-heightCrop)/2,widthCrop,heightCrop,0,0,this.assetData.w,this.assetData.h);
        //     this.img = canvas;
        // }
    }.bind(this);
    var videoFailed = function(){
    	console.log("video element load failed");
        this.failed = true;
        this.globalData.elementLoaded();
    }.bind(this);

    var videoTimeUpdate = function(){
        // todo: resize
        this.helperCtx.drawImage(this.vid, 0, 0);

    }.bind(this);

    this.vid = document.createElement('video');
    // document.body.appendChild(this.vid);
    this.vid.addEventListener('loadeddata', videoLoaded, false);
    this.vid.addEventListener('error', videoFailed, false);
    this.vid.addEventListener('timeupdate', videoTimeUpdate, false);
    var assetPath = this.globalData.getAssetsPath(this.assetData);
    this.vid.src = assetPath;
    // this.addSourceToVideo(this.vid, assetPath, 'video/mp4');
    // this.vid.load();

    this.helperCanvas = document.createElement('canvas');
    this.helperCanvas.width = this.assetData.w;
    this.helperCanvas.height = this.assetData.h;
    this.helperCtx = this.helperCanvas.getContext('2d');

    console.log(this.vid);

    this._parent.createElements.call(this);

};

CVVideoElement.prototype.addSourceToVideo = function(element, src, type) {
    var source = document.createElement('source');
    source.src = src;
    source.type = type;
    element.appendChild(source);
}

CVVideoElement.prototype.renderFrame = function(parentMatrix){
	// console.log("render video frame ");
	// console.log(this.globalData);
   
    if(this.failed){
    	console.log('failed to load video');
        return;
    }
    if(this._parent.renderFrame.call(this,parentMatrix)===false){
        return;
    }
    var ctx = this.canvasContext;
    this.globalData.renderer.save();
    var finalMat = this.finalTransform.mat.props;
    this.globalData.renderer.ctxTransform(finalMat);
    this.globalData.renderer.ctxOpacity(this.finalTransform.opacity);
    
    if(!isNaN(this.vid.duration)){
    	var time = Math.min(this.globalData.renderer.currentFrameNum/this.globalData.frameRate, this.vid.duration);
    // 	// time = Math.round(time);
        // time = 2;
    	// console.log('t = ' + time);
    	this.vid.currentTime = time;
        this.canvasContext.drawImage(this.helperCanvas, 0, 0);
    }
    // ctx.drawImage(this.helperCanvas, 0, 0);
    // ctx.drawImage(this.img,0,0);

    this.globalData.renderer.restore(this.data.hasMask);
    if(this.firstFrame){
        this.firstFrame = false;
    }

};

CVVideoElement.prototype.destroy = function(){
	console.log("destroy video");
    
    this.vid = null;
    this._parent.destroy.call();
};