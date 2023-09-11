//DOM Elements shortcuts
var app, menu, player, infos;
var video, log;

//Data containers
var bornes, borne, selectedBorne;

//Bools
var isMobile = false;
var isDev = true;
var videoIsFading = false;
var videoPaused = false;
var clickEnabled = false;

var currentVideo = null;
var currentSection = 'menu';

var fadeDuration = 1500;
var showCaptions = true;
var fadeOutInterval;
var scalingRatio = 1; // var borne;
var touchEvent = 'touchstart';
var touchEnd = 'touchend';

var previousTouch;

window.addEventListener('load', function () {
  WebSocketTest();

  app = document.querySelector('#app');
  menu = document.querySelector('#menu');
  player = document.querySelector('#player');
  infos = document.querySelector('#infos');
  video = document.querySelector('#video');
  log = document.querySelector('#log');

  //Define Touch events if mobile or web
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );
  // isMobile = true
  touchEvent = isMobile ? 'touchstart' : 'mousedown';
  touchEnd = isMobile ? 'touchend' : 'mouseup';

  app.addEventListener(touchEvent, function (e) {
    clearIdleTimeout();
  });

  fillScreen(isMobile);

  //Get data for all bornes
  bornes = data.bornes;
  //Get borne number
  selectedBorne = window.localStorage.getItem('borne');
  borneIndex = selectedBorne ? selectedBorne : 1;

  //Get data for this borne
  borne = bornes.find((b) => b.id == borneIndex);

  intializeMenu(borne);
  initVideoListeners(video);

  showMenu();
});
