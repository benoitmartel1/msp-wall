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
    tracks.mode = 'showing';
  };
});
function fadeOutVideo(video, hasSound) {
  videoIsFading = true;
  video.classList.add('disabled');
  if (hasSound) {
    fadeOutInterval = setInterval(() => {
      var newVolume = video.volume - 50 / fadeDuration;
      if (newVolume > 0) {
        video.volume = newVolume;
      }
    }, 50);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(fadeOutInterval);
      videoIsFading = false;
      video.pause();
      video.removeAttribute('src');
      video.load();
      resolve();
    }, fadeDuration);
  });
}

async function playVideo(videoName) {
  currentVideo = videoName;

  if (!videoIsFading) {
    //Show Ecouteurs
    // document.querySelector('#loading').style.display = 'block';
    //Hide current Show player
    show(player);
    //Hide Nav
    document.querySelector('#nav').style.left = '-100px';
    //Show headset
    document.querySelector('#headset').style.opacity = 1;
    //Fadeout back loop
    await fadeOutVideo(document.getElementById('loop-video'), false);
    //Wait x seconds
    await delay(headsetDelay);

    //Clear the fadeOut if still occuring
    clearInterval(fadeOutInterval);

    //Check if captions exist
    var vttPath = 'vtt/' + videoName + '.vtt';
    showCaptions = UrlExists(vttPath);

    //Load vtt in track
    if (showCaptions) {
      document.querySelector('track').src = vttPath;
    }

    //Prepare the new video
    video.src = 'videos/' + (isDev ? 'lo/' : '') + videoName + '.mp4';
    video.volume = 1;

    video.oncanplaythrough = (event) => {
      video.classList.remove('disabled');
      video.classList.add('visible');

      document.querySelector('.caption').style.display = showCaptions
        ? 'none'
        : 'none';

      //Hide headset
      document.querySelector('#headset').style.opacity = 0;

      //Show Nav
      document.querySelector('#nav').style.left = 0;
      video.play();
      clearIdleTimeout();
    };
  }
}
async function stopVideo() {
  document.querySelector('track').src = 'vtt/empty.vtt';
  document.querySelector('.caption').style.display = 'none';

  await fadeOutVideo(video, true);
}
function initVideoListeners(p) {
  //Pause video
  p.addEventListener(touchEvent, function (e) {
    if (!p.paused) {
      p.pause();
    } else {
      p.play();
    }
  });
  p.onended = (event) => {
    onInfos();
  };
}
