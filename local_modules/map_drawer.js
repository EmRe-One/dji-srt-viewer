function mapImagesModule() {
  //
  let mapImgsArr;
  let mapUrlsArr;
  let reloadRequested = false; //timeout and reloadrequested allow for delayed api calls to avoid consumint too many resources
  const timeout = 5000;
  let lastCall = -timeout;

  function loadingImg(p) {
    p.fill(50);
    p.noStroke();
    p.textSize(25);
    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Loading map...', 0, 0);
  }

  function loadMapStyle(mp, style, p) {
    let currentTime = window.performance.now();
    if (style != 'none' && mapImgsArr) {
      if (currentTime - lastCall > timeout) {
        //don't call too often)
        lastCall = currentTime;
        for (let i = 0; i < mapUrlsArr.length; i++) {
          mapImgsArr[i][style] = p.loadImage(mapUrlsArr[i].url);
        }
      } else if (!reloadRequested) {
        reloadRequested = true;
        setTimeout(() => {
          reloadRequested = false;
          loadMapStyle(mp, style, p);
        }, timeout - (currentTime - lastCall) + 1);
      }
    }
  }

  return {
    refresh: function(mp, p, reload) {
      mapUrlsArr = mp.getUrlsAndXY();
      if (reload || !mapImgsArr) mapImgsArr = mapUrlsArr;
      if (!mapImgsArr || !mapImgsArr[0] || !mapImgsArr[0][mp.getStyle()])
        reload = true;
      if (reload) {
        loadMapStyle(mp, mp.getStyle(), p);
      }
    },
    paint: function(mp, p) {
      if (mp.getStyle() != 'none' && mapImgsArr) {
        let style = mp.getStyle();
        mapImgsArr.forEach(img => {
          if (img[style] && img[style].width > 1) {
            p.image(img[style], img.x, img.y);
          } else {
            loadingImg(p);
          }
        });
      }
    }
  };
}

module.exports = mapImagesModule();
