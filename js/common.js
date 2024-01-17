var idleTimeout;
var idleTimeoutDuration = 30000;
var hasMoved = false;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function fillScreen(isMobile) {
  var vh;
  if (isMobile) {
    vh = Math.max(document.documentElement.clientWidth || 0);
  } else {
    vh = Math.max(document.documentElement.clientHeight || 0);
    // vh = Math.max(1600 || 0);
  }

  const ratio = vh / (isMobile ? 2160 : 3840);
  scalingRatio = ratio;

  //   if (log) {
  //     log.innerText = 'Ratio est de ' + ratio;
  //     log.innerText = ratio;
  //   }

  app.style.transform = 'scale(' + ratio + ')';
}
// function show(item) {
//   currentSection = item.id;

//   //Hide others
//   document.querySelectorAll('.front').forEach((s) => {
//     s.classList.remove('front');
//   });

//   document.querySelectorAll('.section').forEach((s) => {
//     if (item !== s) {
//       s.classList.remove('visible');
//     }
//   });

//   //Show section
//   item.classList.add('front');
//   item.classList.add('visible');

//   document.querySelector('#nav .info').classList.remove('disabled');
//   document.querySelector('#nav .back').classList.add('disabled');
//   switch (item.id) {
//     case 'player':
//       document.querySelector('#nav .back').classList.remove('disabled');
//       break;
//     case 'infos':
//       document.querySelector('#nav .info').classList.add('disabled');
//       break;
//     default:
//       break;
//   }
// }
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
async function setLoopSrc(type) {
  //Set the video loop in background
  return new Promise((resolve) => {
    var l = document.getElementById('loop-video');
    var videoPath = 'videos/loop/' + type + '/' + borne.id + '.mp4';
    if (l.src == '') {
      l.src = videoPath;
      l.type = 'video/mp4';

      // l.addEventListener('ended', function (e) {
      //   displayLog('ended')
      //   this.currentTime = 0.1;
      //   this.play()
      // })
      l.oncanplay = async function (event) {
        // displayLog('play')
        l.classList.remove('disabled');
        await delay(1500);
        resolve();
      };
    } else {
      resolve();
    }
  });
}

function displayLog(msg) {
  log.innerText = msg;
  setTimeout(() => {
    log.innerText = '';
  }, 2000);
}

function setIdleTimeout() {
  console.log('set idle');
  idleTimeout = setTimeout(() => {
    console.log('Timeout');
    console.log('back from timeout');
    onBack();
  }, idleTimeoutDuration);
}

function clearIdleTimeout() {
  // console.log('clear idle');

  clearTimeout(idleTimeout);
  if (
    currentSection == 'infos' ||
    (currentSection == 'player' && videoPaused)
  ) {
    // console.log('Setting because' + video.paused);
    setIdleTimeout();
  }
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
