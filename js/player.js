var headsetDelay = 2000;

document.addEventListener('keyup', (e) => {
  var vid = document.getElementById('video');
  if (e.key == 's' && !vid.paused) {
    vid.currentTime = vid.duration - 3;
  }
});

window.addEventListener('load', function () {
  // displayLog('999')
  var p = document.getElementById('video');
  p.onloadstart = function () {
    var tracks = p.textTracks[0];

    tracks.addEventListener('cuechange', function (e2) {
      let cue = e2.currentTarget.activeCues[0];
      var c = document.querySelector('.caption');
      c.innerText = showCaptions && cue ? cue.text : '';
      //   console.log(c.innerText);
      c.style.display = c.innerText.trim().length < 2 ? 'none' : 'block';
    });
    tracks.mode = 'hidden';
  };
});
function fadeOutVideo(video, hasSound) {
  videoIsFading = true;
  video.classList.add('disabled');
  if (hasSound == true) {
    // console.log('Setting Interval');
    // console.log(fadeOutInterval);
    var fadeOutInterval = setInterval(() => {
      if (video) {
        if (video.volume > 0.05) {
          video.volume -= 0.05;
        } else {
          console.log('clearing audio fade');
          clearInterval(fadeOutInterval);
        }
      } else {
        clearInterval(fadeOutInterval);
      }
    }, 50);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      // displayLog('timeout')
      //   if (fadeOutInterval) clearInterval(fadeOutInterval);
      videoIsFading = false;
      //   console.log(videoIsFading);
      // video.pause();
      video.removeAttribute('src');
      video.load();
      resolve();
    }, fadeDuration);
  });
}

async function showPlayer(videoName) {
  currentSection = 'player';

  currentVideo = videoName;
  //   displayLog('show before fade');
  if (!videoIsFading) {
    //Show Ecouteurs
    // document.querySelector('#loading').style.display = 'block';
    //Hide current Show player
    // displayLog('show Player');
    player.classList.add('front');
    player.classList.add('visible');
    //Hide Nav
    document.querySelector('#nav').style.left = '-100px';

    document.querySelector('#nav .info').classList.remove('disabled');
    document.querySelector('#nav .back').classList.remove('disabled');

    //Show headset
    document.querySelector('#headset').classList.add('visible');

    //Fadeout back loop
    // await fadeOutVideo(document.getElementById('loop-video'), false);
    //Wait x seconds
    await delay(headsetDelay);

    //Clear the fadeOut if still occuring
    // clearInterval(fadeOutInterval);

    //Check if captions exist
    var vttPath = 'vtt/' + videoName + '.vtt';
    showCaptions = UrlExists(vttPath);

    //Load vtt in track
    if (showCaptions) {
      document.querySelector('track').src = vttPath;
    }

    //Prepare the new video
    video.src = 'videos/delayed/' + videoName + '.mp4';

    video.addEventListener('timeupdate', checkIfEndIsComing, false);
    video.onplay = (event) => {
      video.volume = 1.0;
      console.log(video.volume);
    };
    video.oncanplaythrough = (event) => {
      //Hide headset
      document.querySelector('#headset').classList.remove('visible');
      // video.volume = 1;

      setTimeout(() => {
        video.play();
        // video.currentTime = video.duration - 8;
        video.classList.remove('disabled');
        video.classList.add('visible');

        //Show Nav
        document.querySelector('#nav').style.left = 0;
        video.volume = 1.0;
        // video.volume = 1.0;
        // video.volume = 100;

        document.querySelector('.caption').style.display = showCaptions
          ? 'none'
          : 'none';

        clickEnabled = true;
      }, 500);

      clearIdleTimeout();
    };
  }
}
async function checkIfEndIsComing() {
  if (this.currentTime > this.duration - 2) {
    // displayLog('Fadeout')
    await hidePlayer();
  }
}
// async function stopVideo() {
//   document.querySelector('track').src = 'vtt/empty.vtt';
//   document.querySelector('.caption').style.display = 'none';

//   await fadeOutVideo(video, true);
// }
function initVideoListeners(p) {
  //Pause video
  // p.addEventListener(touchEvent, function (e) {
  //   if (clickEnabled && currentSection == 'player') {
  //     if (!p.paused && currentSection == 'player') {
  //       videoPaused = true
  //       p.pause();
  //     } else {
  //       videoPaused = false
  //       p.play();
  //     }
  //   }
  // });
  p.onended = async function (event) {
    p.removeAttribute('src'); // empty source
    p.load();
    console.log(p.src);
    // await hidePlayer();
    showInfos();
  };
}
