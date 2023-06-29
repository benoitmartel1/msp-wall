var titleInterval;
var titleSwitchIntervalDuration = 3000;
var titlesAreSame = [false, false];

async function intializeMenu(borne) {
  //Set background video at the back
  await setLoopSrc();

  document.querySelector('.choices').classList.remove('alt');
  if (borne.isAlt) document.querySelector('.choices').classList.add('alt');

  //Define the click zones
  document.querySelectorAll('.clickZone').forEach((item, index) => {
    //Set the SVG clip path on left button
    if (index == 0) {
      item.style.clipPath = 'polygon(' + borne.clipPath + ')';
    }
    //On click listener
    item.addEventListener('touchstart', function (e) {
      //   currentVideo = borne.choices[index].path;
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
  });

  //Check if titles are same in FR and EN to avoid switch animation
  borne.choices.forEach((item, index) => {
    titlesAreSame[index] = item.fr == item.en;
  });

  //Start the interval to switch titles between languages
  titleInterval = setInterval(() => {
    if (currentVideo == null) {
      document.querySelectorAll('.choice').forEach((item, index) => {
        if (!titlesAreSame[index]) {
          let isVisible = item
            .querySelector('.title.fr')
            .classList.contains('disabled');
          item
            .querySelector('.title.' + (isVisible ? 'fr' : 'en'))
            .classList.remove('disabled');
          item
            .querySelector('.title.' + (!isVisible ? 'fr' : 'en'))
            .classList.add('disabled');
        }
      });
    }
  }, titleSwitchIntervalDuration);
}
