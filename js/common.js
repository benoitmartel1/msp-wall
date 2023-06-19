function fillScreen() {
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const ratio = vh / 3840;
  scalingRatio = ratio;
  var app = document.querySelector('#app');
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
  //   console.log(item.);
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
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
}
const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
