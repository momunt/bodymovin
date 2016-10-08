var ImagePreloader = (function(){

    function imageLoaded(){
        this.loadedAssets += 1;
        if(this.loadedAssets === this.totalImages){
        }
    }

    function getAssetsPath(assetData){
        var path = '';
        if(this.assetsPath){
            var imagePath = assetData.p;
            if(imagePath.indexOf('images/') !== -1){
                imagePath = imagePath.split('/')[1];
            }
            path = this.assetsPath + imagePath;
        } else {
            path = this.path;
            path += assetData.u ? assetData.u : '';
            path += assetData.p;
        }
        return path;
    }

    function loadImage(path){
        console.log("preloading image " + path);
        var img = document.createElement('img');
        img.addEventListener('load', imageLoaded.bind(this), false);
        img.addEventListener('error', imageLoaded.bind(this), false);
        img.src = path;
    }
    function loadVideo(path){
        console.log("preloading video " + path);
        var vid = document.createElement('video');
        var self = this;
        vid.addEventListener('loadeddata', function() {

          if(vid.readyState == 4) {
            imageLoaded.bind(self);
          }

        });

        vid.addEventListener('error', imageLoaded.bind(this), false);
        vid.src = path;
    }
    function loadAssets(assets){
        this.totalAssets = assets.length;
        var i;
        for(i=0;i<this.totalAssets;i+=1){
            if(!assets[i].layers){
                var type = assets[i].ty;
                if(type == 2){
                    loadImage.bind(this)(getAssetsPath.bind(this)(assets[i]));
                }
                // else if(type==9){
                    // TODO: START PRELOADING FRAMES
                //     loadVideo.bind(this)(getAssetsPath.bind(this)(assets[i]));
                // }
                this.totalImages += 1;
            }
        }
    }

    function setPath(path){
        this.path = path || '';
    }

    function setAssetsPath(path){
        this.assetsPath = path || '';
    }

    return function ImagePreloader(){
        this.loadAssets = loadAssets;
        this.setAssetsPath = setAssetsPath;
        this.setPath = setPath;
        this.assetsPath = '';
        this.path = '';
        this.totalAssets = 0;
        this.totalImages = 0;
        this.loadedAssets = 0;
    }
}());