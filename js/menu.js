async function initMenuItems(borne) {
  //Define the click zones
  document.querySelectorAll('.clickZone').forEach((item, index) => {
    console.log(index);
    let id = borne.choices[index].id;

    //Set the SVG clip path
    if (index == 0) {
      item.style.clipPath = 'polygon(' + borne.clipPath + ')';
    }

    //On click listener
    item.addEventListener('click', function (e) {
      document.querySelectorAll('.choice')[index].classList.add('selected');
      playVideo(borne.choices[index].path);
    });
  });

  await setLoopSrc();

  //Set the text for each button
  document.querySelectorAll('.choice').forEach((item, index) => {
    item.querySelector('.title').innerText = borne.choices[index].fr;
  });
}
async function setLoopSrc() {
  //Set the video loop in background

  return new Promise((resolve) => {
    var l = document.getElementById('loop-video');
    l.src = 'videos/loop/' + borne.id + '.mp4';
    l.oncanplay = (event) => {
      l.classList.remove('disabled');
      resolve();
    };
  });
}
