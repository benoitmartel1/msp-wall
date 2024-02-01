//DOM elements
var qr, featured;

//Comment out on production, used to generate clicks for testing
//-----------------------------------------------------------------
async function autoTriggerVideo() {
  await delay(4000);
  if (clickEnabled) {
    const videos = data.bornes.flatMap((e) => [
      e.choices[0].path,
      e.choices[1].path,
    ]);
    const random = Math.floor(Math.random() * videos.length);
    await hideInfos();
    showPlayer(videos[random]);
  }
}
//-----------------------------------------------------------------
async function intializeInfos() {
  //Comment out on production, used to generate clicks for testing
  //-----------------------------------------------------------------
  if (autoTriggerMode) {
    autoTriggerVideo();
  }

  //-----------------------------------------------------------------

  qr = document.querySelector('.qr');
  featured = document.querySelector('.featured');

  //Set QR code Name above
  var currentVideoName;

  //Retrieve name of the current selected video if one to display above QR
  bornes.forEach((b) => {
    let tempNameFr = b.choices.find((c) => c.path == currentVideo)?.fr;
    let tempNameEn = b.choices.find((c) => c.path == currentVideo)?.en;
    if (tempNameFr)
      currentVideoName =
        tempNameFr + (tempNameEn !== tempNameFr ? ' / ' + tempNameEn : '');
  });

  document.querySelector('.borne-name').innerText =
    currentVideoName?.replace('\n', '') || '';

  //Clear containers
  qr.innerHTML = '';
  featured.innerHTML = '';

  window.addEventListener(
    'qrReady',
    function (e) {
      qr.classList.remove('disabled');
    },
    false
  );

  getQr(currentVideo);

  //Populate featured
  borne.choices.forEach((c) => {
    const img = document.createElement('img');

    img.classList.add('disabled');

    img.src = 'images/videos/' + c.path + '.png';
    featured.append(img);

    img.addEventListener('load', fadeImg);

    img.addEventListener(touchEvent, async function (e) {
      await hideInfos();
      showPlayer(c.path);
    });
  });
}

function fadeImg() {
  setTimeout(() => {
    this.classList.remove('disabled');
  }, 30);
}

// //=========Functions for QR Code
function displayQr(url) {
  const div = document.createElement('div');
  new QRCode(div, {
    text: url,
    width: 150,
    height: 150,
    colorDark: '#000000',
    colorLight: '#ffffff',
  });

  qr.append(div);

  const text = document.createElement('div');
  text.innerText = url;
  text.classList.add('text');
  qr.append(text);
}
function getQr(video) {
  var qrAddress =
    'https://raw.githubusercontent.com/benoitmartel1/msp-wall/main/qr.json?date=' +
    new Date();

  console.log(qrAddress);
  axios
    .get(qrAddress)
    .then((res) => {
      console.log(res);
      //If web access
      if (res.data.qrCodes)
        localStorage.setItem('qr', JSON.stringify(res.data));

      displayQr(findQrUrl(res.data, video));
    })
    .catch((err) => {
      //If offline, then get last qr codes stored in localstorage

      var localStorageJson = JSON.parse(localStorage.getItem('qr'));

      if (localStorageJson) {
        // displayLog('local');
        if (localStorageJson.qrCodes) {
          //   displayLog(localStorageJson.qrCodes);
          displayQr(findQrUrl(localStorageJson, video));
        }
      } else {
        // If no qr stored in local
        displayQr('https://montsaintpierre.ca/');
      }
    });
}
function findQrUrl(data, video) {
  return data.qrCodes.find(
    (q) => q.video == (video !== null ? video : 'default')
  ).url;
}
