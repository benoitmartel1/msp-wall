let idleTimeout;

function setIdleTimeout() {
  idleTimeout = setTimeout(() => {
    console.log('back from timeout');
    onBack();
  }, 20000);
}

function clearIdleTimeout() {
  clearTimeout(idleTimeout);
}

window.addEventListener('load', function () {
  document.querySelector('.arrow.left').addEventListener('click', function () {
    moveToSelected('prev');
  });
  document.querySelector('.arrow.right').addEventListener('click', function () {
    moveToSelected('next');
  });
});

function intializeInfos() {
  document.querySelector('.qr').style.transition = 'none';
  document.querySelector('.qr').innerHTML = '';
  getQr(currentVideo);

  var featured = document.querySelector('.featured');
  var carousel = document.querySelector('#carousel');

  //Clear containers
  featured.innerHTML = '';
  carousel.innerHTML = '';

  //Populate featured
  let borne = bornes.find((b) => b.id == selectedBorne);
  borne.choices.forEach((c) => {
    const img = document.createElement('img');
    if (c.path == currentVideo) {
      img.classList.add('disabled');
    }
    img.addEventListener('load', fadeImg);
    img.style.opacity = '0';
    img.addEventListener('click', function (e) {
      playVideo(c.path);
    });
    img.src = 'images/videos/' + c.path + '.png';
    featured.append(img);
  });

  //Populate carousel
  populateCarousel(
    bornes
      .flatMap((e) => e.choices)
      .filter(
        (v) => v.id !== borne.choices[0].id && v.id !== borne.choices[1].id
      )
  );
}
//=========Functions for Carousel
function populateCarousel(videos) {
  var midItem = Math.floor(videos.length / 2);
  videos.forEach((v, index) => {
    var myClass;
    switch (index - midItem) {
      case 0:
        myClass = 'selected';
        break;
      case 1:
        myClass = 'next';
        break;
      case 2:
        myClass = 'nextRightSecond';
        break;
      case -1:
        myClass = 'prev';
        break;
      case -2:
        myClass = 'prevLeftSecond';
        break;
      default:
        myClass = index - midItem > 2 ? 'hideRight' : 'hideLeft';
        break;
    }

    const div = document.createElement('div');
    const img = document.createElement('img');
    div.classList.add(myClass);

    img.src = 'images/videos/' + v.path + '.png';
    // img.src = 'images/videos/para.jpg';
    img.addEventListener('load', fadeImg);
    img.style.opacity = '0';
    img.addEventListener('click', function (e) {
      selectVideo(e, v.path);
    });
    div.append(img);
    document.querySelector('#carousel').append(div);
  });
}
function fadeImg() {
  this.style.transition = 'opacity 400ms';
  this.style.opacity = '1';
}
function selectVideo(elem, name) {
  if (elem.target.parentNode.classList.contains('selected')) {
    playVideo(name);
  } else {
    moveToSelected(elem.target.parentNode);
  }
}

function moveToSelected(element) {
  clearIdleTimeout();
  setIdleTimeout();
  //   console.log(document.querySelector('#carousel .selected'));
  //   console.log(document.querySelector('.selected').nextElementSibling);

  if (document.querySelector('#carousel .selected')) {
    var next;
    var prev;
    var prevSecond;
    var nextSecond;
    if (element == 'next') {
      var selected = document.querySelector(
        '#carousel .selected'
      ).nextElementSibling;
    } else if (element == 'prev') {
      var selected = document.querySelector(
        '#carousel .selected'
      ).previousElementSibling;
    } else {
      var selected = element;
    }
    if (selected) {
      next = selected.nextElementSibling;
      prev = selected.previousElementSibling;
      selected.classList.remove(...selected.classList);
      selected.classList.add('selected');
    }

    if (prev) {
      prev.classList.remove(...prev.classList);
      prev.classList.add('prev');
      prevSecond = prev.previousElementSibling;
    }
    if (next) {
      next.classList.remove(...next.classList);
      next.classList.add('next');
      nextSecond = next.nextElementSibling;
    }
    if (nextSecond) {
      nextSecond.classList.remove(...nextSecond.classList);
      nextSecond.classList.add('nextRightSecond');
      nextAll(nextSecond).forEach((elem) => {
        elem.classList.remove(...elem.classList);
        elem.classList.add('hideRight');
      });
    }
    if (prevSecond) {
      prevSecond.classList.remove(...prevSecond.classList);
      prevSecond.classList.add('prevLeftSecond');
      prevAll(prevSecond).forEach((elem) => {
        elem.classList.remove(...elem.classList);
        elem.classList.add('hideLeft');
      });
    }
  }
}
const nextAll = (element) => {
  const nextElements = [];
  let nextElement = element;

  while (nextElement.nextElementSibling) {
    nextElements.push(nextElement.nextElementSibling);
    nextElement = nextElement.nextElementSibling;
  }

  return nextElements;
};
const prevAll = (element) => {
  const prevElements = [];
  let prevElement = element;

  while (prevElement.previousElementSibling) {
    prevElements.push(prevElement.previousElementSibling);
    prevElement = prevElement.previousElementSibling;
  }

  return prevElements;
};

//=========Functions for QR Code
function displayQr(url) {
  var q = document.querySelector('.qr');

  q.style.opacity = '0';
  const div = document.createElement('div');
  new QRCode(div, {
    text: url,
    width: 150,
    height: 150,
    colorDark: '#000000',
    colorLight: '#ffffff',
  });

  q.append(div);

  setTimeout(() => {
    q.style.transition = 'opacity 200ms';
    q.style.opacity = '1';
  }, 200);

  const text = document.createElement('div');
  text.innerText = url;
  text.classList.add('text');
  document.querySelector('.qr').append(text);
}
function getQr(video) {
  var qrAddress =
    'https://raw.githubusercontent.com/benoitmartel1/msp-wall/main/qr.json?date=' +
    new Date();
  //   var qrAddress =
  //     'https://dev.benoitmartel.com/msp-wall/qr.json?date=' + new Date();
  axios
    .get(qrAddress)
    .then((res) => {
      console.log(res)
      let videoName = video !== null ? video : 'default';
      let qr = res.data.qrCodes.find((q) => q.video == videoName);

      displayQr(qr.url);
    })
    .catch((err) => {
      console.log(err)
      displayQr('https://montsaintpierre.ca/');
    });
}
