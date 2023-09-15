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

async function onInfos() {
  currentSection == 'player' ? await hidePlayer() : await hideMenu();
  //   await delay(4000);
  showInfos();
}

async function onBack() {
  currentSection == 'player' ? await hidePlayer() : await hideInfos();
  // displayLog('showMenu')
  showMenu();
}

async function showMenu() {
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
    // el.classList.remove('disabled');
  });

  //   clearInterval(titleInterval);
  //   setTitleInterval();

  await setLoopSrc('normal');

  menu.classList.add('front');
  menu.classList.add('visible');

  await delay(700);

  clickEnabled = true;
}

async function hideMenu() {
  clickEnabled = false;
  closeNav();
  //Hide Nav
  document.querySelector('#nav').style.left = '-100px';

  switchTitles = false;
  menu.classList.remove('front');
  menu.classList.remove('visible');

  // document.querySelector('#loop-video').classList.add('disabled');

  await delay(800);
  // document.getElementById('loop-video').pause();
  await fadeOutVideo(document.getElementById('loop-video'), false);
}

async function hidePlayer() {
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
  player.classList.remove('visible');

  // await delay(3000)
}

async function showInfos() {
  currentSection = 'infos';

  intializeInfos();
  await setLoopSrc('blurred');

  document.querySelector('#nav .info').classList.add('disabled');
  document.querySelector('#nav .back').classList.add('disabled');

  document.querySelector('#nav').style.left = '0';

  infos.classList.add('front');
  infos.classList.add('visible');

  await delay(800);
  document.querySelector('.carousel').classList.add('visible');

  clickEnabled = true;
  clearIdleTimeout();
}

async function hideInfos() {
  clickEnabled = false;
  closeNav();
  document.querySelector('#nav').style.left = '-100px';

  qr.classList.add('disabled');

  infos.classList.remove('front');
  infos.classList.remove('visible');

  await delay(800);
  document.getElementById('loop-video').pause();
  await fadeOutVideo(document.getElementById('loop-video'), false);
  document.querySelector('.carousel').classList.remove('visible');
}
