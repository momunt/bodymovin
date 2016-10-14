function IVideoElement(data,parentContainer,globalData,comp,placeholder){
    this.assetData = globalData.getAssetData(data.refId);
    this._parent.constructor.call(this,data,parentContainer,globalData,comp,placeholder);
}
createElement(SVGBaseElement, IVideoElement);

IVideoElement.prototype.createElements = function(){

    var assetPath = this.globalData.getAssetsPath(this.assetData);

    this._parent.createElements.call(this);

    this.innerElem = document.createElementNS(svgNS,'image');
    this.innerElem.setAttribute('width',this.assetData.w+"px");
    this.innerElem.setAttribute('height',this.assetData.h+"px");
    this.innerElem.setAttribute('preserveAspectRatio','xMidYMid slice');
    this.innerElem.setAttributeNS('http://www.w3.org/1999/xlink','href',assetPath);
    this.maskedElement = this.innerElem;
    this.layerElement.appendChild(this.innerElem);
    if(this.data.ln){
        this.innerElem.setAttribute('id',this.data.ln);
    }
    if(this.data.cl){
        this.innerElem.setAttribute('class',this.data.cl);
    }

};

IVideoElement.prototype.hide = function(){
    if(!this.hidden){
        this.innerElem.style.display = 'none';
        this.hidden = true;
    }
};

IVideoElement.prototype.renderFrame = function(parentMatrix){
    var renderParent = this._parent.renderFrame.call(this,parentMatrix);
    if(renderParent===false){
        this.hide();
        return;
    }
    // update frame
    var assetPath = this.globalData.getAssetsPathForFrame(this.assetData, this.globalData.frameNum);
    this.innerElem.setAttributeNS('http://www.w3.org/1999/xlink','href',assetPath);

    if(this.hidden){
        this.hidden = false;
        this.innerElem.style.display = 'block';
    }
    if(this.firstFrame){
        this.firstFrame = false;
    }
};

IVideoElement.prototype.destroy = function(){
    this._parent.destroy.call();
    this.innerElem =  null;
};