window.addEventListener('load', function () {
  var p = document.getElementById('video');
  p.onloadstart = function () {
    var tracks = p.textTracks[0];

    tracks.addEventListener('cuechange', function (e2) {
      let cue = e2.currentTarget.activeCues[0];
      var c = document.querySelector('.caption');
      c.innerText = showCaptions && cue ? cue.text : '';
      //   console.log(c.innerText);
      c.style.display = c.innerText.length < 2 ? 'none' : 'block';
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
      video.src = '';
      resolve();
    }, fadeDuration);
  });
}

async function playVideo(videoName) {
  clearIdleTimeout();
  if (!videoIsFading) {
    document.querySelector('#loading').style.display = 'block';

    show(document.querySelector('#player'));
    //Fadeout back loop
    await fadeOutVideo(document.getElementById('loop-video'), false);

    // document.getElementById('loop-video').src = '';
    // currentVideo = videoName;

    var p = document.getElementById('video');
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
    p.src = 'videos/' + videoName + '.mp4';
    p.volume = 1;

    p.oncanplaythrough = (event) => {
      p.classList.remove('disabled');
      p.classList.add('visible');

      document.querySelector('.caption').style.display = showCaptions
        ? 'none'
        : 'none';

      document.querySelector('#loading').style.display = 'none';
      p.play();
    };
  }
}
async function stopVideo() {
  document.querySelector('track').src = 'vtt/empty.vtt';
  document.querySelector('.caption').style.display = 'none';

  await fadeOutVideo(document.getElementById('video'), true);
}
function initVideoListeners(p) {
  //Pause video
  p.addEventListener('click', function (e) {
    if (!p.paused) {
      //   console.log('pause');
      p.pause();
    } else {
      p.play();
    }
  });
  p.onended = (event) => {
    onInfos();
  };
}
