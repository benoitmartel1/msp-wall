var titleInterval;

async function initMenuItems(borne) {
  titleInterval = setInterval(() => {
    // console.log(currentVideo);
    if (currentVideo == null) {
      document.querySelectorAll('.choice').forEach((item, index) => {
        let isVisible = item
          .querySelector('.title.fr')
          .classList.contains('disabled');
        item
          .querySelector('.title.' + (isVisible ? 'fr' : 'en'))
          .classList.remove('disabled');
        item
          .querySelector('.title.' + (!isVisible ? 'fr' : 'en'))
          .classList.add('disabled');
      });
    }
  }, 3000);

  //Define the click zones
  document.querySelectorAll('.clickZone').forEach((item, index) => {
    let id = borne.choices[index].id;

    //Set the SVG clip path
    if (index == 0) {
      item.style.clipPath = 'polygon(' + borne.clipPath + ')';
    }

    //On click listener
    item.addEventListener('click', function (e) {
      currentVideo = borne.choices[index].path;
      document.querySelectorAll('.choice')[index].classList.add('selected');
      document
        .querySelectorAll('.choice')
        [Math.abs(index - 1)].classList.add('disabled');
      setTimeout(() => {
        playVideo(borne.choices[index].path);
      }, 1000);
    });
  });
  //Set the text for each button
  document.querySelectorAll('.choice').forEach((item, index) => {
    item.querySelector('.title.fr').innerText = borne.choices[index].fr;
    item.querySelector('.title.en').innerText = borne.choices[index].en;
    // item.querySelector('.title.fr').innerText = 'patin';
    // item.querySelector('.title.en').innerText = 'matin';
  });
  await setLoopSrc();
}
async function setLoopSrc() {
  //Set the video loop in background

  return new Promise((resolve) => {
    var l = document.getElementById('loop-video');
    l.src = 'videos/loop/' + borne.id + '.mp4';
    // log.innerText = l.src;
    l.oncanplay = (event) => {
      l.classList.remove('disabled');
      resolve();
    };
  });
}
