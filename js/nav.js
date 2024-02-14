let secretTimer;
let secretCount = 0;
let navTimeout;
let navTimeoutDuration = 4000;

window.addEventListener('load', function () {
  //Attach nav button Listeners
  //Nav TAB toggle
  document.querySelector('#nav').addEventListener(touchEvent, function (e) {
    toggleNav();
  });
  //Nav INFO click
  document
    .querySelector('#nav .info')
    .addEventListener(touchEvent, function (e) {
      e.stopPropagation();
      if (!e.target.classList.contains('disabled')) {
        onInfos();
        closeNav();
      }
    });
  //Nav BACK click
  document
    .querySelector('#nav .back')
    .addEventListener(touchEvent, function (e) {
      e.stopPropagation();
      if (!e.target.classList.contains('disabled')) {
        onBack();
        closeNav();
      }
    });
  //SECRET click
  document.querySelector('#secret').addEventListener(touchEvent, function (e) {
    onSecret();
  });
});

function toggleNav() {
  clearTimeout(navTimeout);
  var n = document.querySelector('#nav');
  if (n.classList.contains('opened')) {
    n.classList.remove('opened');
  } else {
    n.classList.add('opened');
    navTimeout = setTimeout(() => {
      n.classList.remove('opened');
    }, navTimeoutDuration);
  }
}
function closeNav() {
  clearTimeout(navTimeout);
  var n = document.querySelector('#nav');
  if (n.classList.contains('opened')) {
    n.classList.remove('opened');
  }
}
//Hidden secret square to go back to index.html to change borne
//This function makes sure you click 3 times fast in the div...
function onSecret() {
  secretCount++;
  if (secretCount > 2) {
    // window.localStorage.clear();
    window.localStorage.removeItem('borne');

    window.location = 'index.html';
  } else {
    clearTimeout(secretTimer);

    secretTimer = setTimeout(() => {
      secretCount = 0;
      clearTimeout(secretTimer);
    }, 1000);
  }
}

async function onInfos() {
  //   showBlackOverlay(true);
  currentSection == 'player' ? await hidePlayer() : await hideMenu();
  //   await delay(4000);
  showInfos();
}

async function onBack() {
  //   showBlackOverlay(true);

  currentSection == 'player' ? await hidePlayer() : await hideInfos();
  // displayLog('showMenu')
  showMenu();
}
function showBlackOverlay(show) {
  if (show) {
    document.querySelector('.blackOverlay').classList.remove('hidden');
  } else {
    document.querySelector('.blackOverlay').classList.add('hidden');
  }
}

async function showMenu() {
  // showBlackOverlay(false);
  currentSection = 'menu';

  currentVideo = null;
  currentChoice = null;
  switchTitles = true;

  document.querySelector('#nav .info').classList.remove('disabled');
  document.querySelector('#nav .back').classList.add('disabled');

  document.querySelector('#nav').style.left = '-100px';

  document.querySelectorAll('.choice').forEach((item) => {
    item.classList.remove('selected');
    item.classList.remove('disabled');
  });

  document.querySelectorAll('.title').forEach((el) => {
    el.classList.remove('animation-disabled');
  });

  await setLoopSrc('normal');
  showBlackOverlay(false);

  menu.classList.add('front');
  menu.classList.add('visible');
  menu.classList.add('opaque');

  await delay(700);

  clickEnabled = true;
  if (autoTriggerEnabled) {
    await delay(2000);
    // console.log('select' + 0)
    onSelectMenuItem(0);
  }
}

async function hideMenu() {
  showBlackOverlay(true);
  clickEnabled = false;
  closeNav();
  //Hide Nav
  document.querySelector('#nav').style.left = '-100px';

  switchTitles = false;
  menu.classList.remove('front');
  menu.classList.remove('opaque');

  await delay(800);

  menu.classList.remove('visible');
  await fadeOutVideo(document.getElementById('loop-video'), false);
}

async function hidePlayer() {
  showBlackOverlay(true);
  clickEnabled = false;
  //Hide Nav
  document.querySelector('#nav').style.left = '-100px';

  document.querySelector('track').src = 'vtt/empty.vtt';
  document.querySelector('.caption').style.display = 'none';
  await delay(600);

  await fadeOutVideo(document.getElementById('video'), true);

  // video.classList.add('disabled');
  // displayLog('Has faded')

  player.classList.remove('front');
  player.classList.remove('opaque');

  await delay(400);

  player.classList.remove('visible');
}

async function showInfos() {
  currentSection = 'infos';

  intializeInfos();
  await setLoopSrc('blurred');

  showBlackOverlay(false);

  document.querySelector('#nav .info').classList.add('disabled');
  document.querySelector('#nav .back').classList.add('disabled');

  if (!presentationMode) {
    document.querySelector('#nav').style.left = '0';
  }
  infos.classList.add('front');
  infos.classList.add('visible');
  infos.classList.add('opaque');

  await delay(800);
  document.querySelector('.carousel').classList.add('visible');

  clickEnabled = true;
  clearIdleTimeout();
}

async function hideInfos() {
  showBlackOverlay(true);
  clickEnabled = false;
  closeNav();
  document.querySelector('#nav').style.left = '-100px';

  qr.classList.add('disabled');

  infos.classList.remove('front');
  infos.classList.remove('opaque');

  await delay(800);

  infos.classList.remove('visible');

  await fadeOutVideo(document.getElementById('loop-video'), false);
  document.querySelector('.carousel').classList.remove('visible');
}
