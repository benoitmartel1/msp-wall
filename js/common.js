



function fillScreen() {
  const vh = Math.max(document.documentElement.clientHeight || 0);
  console.log(document.documentElement.clientHeight);
  const ratio = vh / 3840;
  scalingRatio = ratio;
  var app = document.querySelector('#app');
  if (log) {
    // log.innerText = 'Ratio est de ' + ratio;
    // log.innerText = ratio;
  }

  app.style.transform = 'scale(' + ratio + ')';
}
function show(item) {
  document.querySelectorAll('.front').forEach((s) => {
    s.classList.remove('front');
  });

  item.classList.add('front');
  item.classList.add('visible');

  document.querySelectorAll('.section').forEach((s) => {
    if (item !== s) {
      s.classList.remove('visible');
    }
  });
  document.querySelector('#nav .info').classList.remove('disabled');
  document.querySelector('#nav .back').classList.add('disabled');
  switch (item.id) {
    case 'player':
      document.querySelector('#nav .back').classList.remove('disabled');
      break;
    case 'infos':
      document.querySelector('#nav .info').classList.add('disabled');
      break;
    default:
      break;
  }
}
function UrlExists(url) {
  try {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
  } catch (error) {
    console.log('Cant access VTT');
    return false;
  }

  return http.status != 404;
}
const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
async function setLoopSrc() {
  //Set the video loop in background
  return new Promise((resolve) => {
    var l = document.getElementById('loop-video');
    var videoPath = 'videos/loop/' + borne.id + '.mp4';
    if (l.src == '' && UrlExists(videoPath)) {
      l.src = videoPath;
      l.oncanplay = (event) => {
        l.classList.remove('disabled');
        resolve();
      };
    } else {
      resolve();
    }
  });
}
