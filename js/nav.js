let secretTimer;
let secretCount = 0;

function onSecret() {
  secretCount++;
  if (secretCount > 2) {
    window.localStorage.clear();
    window.location = 'index.html';
  } else {
    clearTimeout(secretTimer);

    secretTimer = setTimeout(() => {
      secretCount = 0;
      clearTimeout(secretTimer);
    }, 1000);
  }
}
function toggleNav() {
  var n = document.querySelector('#nav');
  if (n.classList.contains('opened')) {
    n.classList.remove('opened');
  } else {
    n.classList.add('opened');
  }
}
async function onInfos() {
  //If leaving player, stop movie, start loop
  if (document.querySelector('#player').classList.contains('visible')) {
    await stopVideo();
    await setLoopSrc();
  }

  document.querySelector('#back').classList.add('blurred');

  intializeInfos();
  show(document.querySelector('#infos'));
}

async function onBack() {
  currentVideo = null;

  //If leaving player, stop movie, start loop
  if (document.querySelector('#player').classList.contains('visible')) {
    await stopVideo();
    await setLoopSrc();
  }

  document.querySelector('#back').classList.remove('blurred');
  show(document.querySelector('#menu'));
}
