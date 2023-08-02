var bornes;
var borne;
var selectedBorne;
var currentVideo = null;
var videoIsFading = false;
var fadeDuration = 600;
var showCaptions = true;
var fadeOutInterval;
var scalingRatio = 1; // var borne;
var log;
var touchEvent = 'touchstart';
var player;
var app;

window.addEventListener('load', function () {
  app = document.querySelector('#app');
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );
  touchEvent = mobile ? 'touchstart' : 'mousedown';

  log = document.getElementById('log');
  fillScreen();

  player = document.getElementById('video');

  //Get data for all bornes
  bornes = data.bornes;
  //Get borne number
  selectedBorne = window.localStorage.getItem('borne');
  borneIndex = selectedBorne ? selectedBorne : 1;

  //Get data for this borne
  borne = bornes.find((b) => b.id == borneIndex);

  show(document.querySelector('#menu'));

  intializeMenu(borne);
  initVideoListeners(player);
});

var touchstartX, touchstartY, touchendX, touchendY;
var touchableElement = document.getElementById('app');
// touchableElement.addEventListener('touchstart', function (event) {
// 	touchstartX = event.changedTouches[0].screenX;
// 	touchstartY = event.changedTouches[0].screenY;
// }, false);

// touchableElement.addEventListener('touchend', function (event) {
// 	touchendX = event.changedTouches[0].screenX;
// 	touchendY = event.changedTouches[0].screenY;
// 	handleGesture();
// }, false);

function handleGesture() {
  if (touchendX < touchstartX) {
    displayLog('Swiped Left');
  }

  if (touchendX > touchstartX) {
    displayLog('Swiped Right');
  }
}
