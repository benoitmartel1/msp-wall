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
  clearIdleTimeout();
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
  //If leaving player, stop movie, start loop
  if (document.querySelector('#player').classList.contains('visible')) {
    await stopVideo();
  }

  document.querySelector('#back').classList.add('blurred');
  // log.innerText = 'ta'
  intializeInfos();
  show(document.querySelector('#infos'));
}

async function onBack() {
  onLeaveInfos();

  clearIdleTimeout();
  currentVideo = null;

  document.querySelectorAll('.choice').forEach((item) => {
    item.classList.remove('selected');
    item.classList.remove('disabled');
  });

  document.querySelectorAll('.title').forEach((el) => {
    el.classList.remove('animation-disabled');
  });
  //If leaving player, stop movie, start loop
  if (document.querySelector('#player').classList.contains('visible')) {
    await stopVideo();
    await setLoopSrc();
  }

  document.querySelector('#back').classList.remove('blurred');
  show(document.querySelector('#menu'));
  switchTitles = true;
}
