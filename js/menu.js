var titleInterval;
var titleSwitchIntervalDuration = 4000;
var titlesAreSame = [false, false];
var switchTitles = true;

async function intializeMenu(borne) {
  document.querySelector('.choices').classList.remove('alt');

  if (borne.isAlt) document.querySelector('.choices').classList.add('alt');

  //Define the click zones
  document.querySelectorAll('.clickZone').forEach((item, index) => {
    //Set the SVG clip path on left button
    if (index == 0) {
      item.style.clipPath = 'polygon(' + borne.clipPath + ')';
    }

    //On CLICK ZONE click listener
    item.addEventListener(touchEvent, async function (e) {
      if (clickEnabled && currentSection == 'menu') {
        console.log('clicked menu item');
        console.log(e);
        clickEnabled = false;
        document.querySelectorAll('.choice')[index].classList.add('selected');
        document
          .querySelectorAll('.choice')
          [Math.abs(index - 1)].classList.add('disabled');

        //Disable shake on buttons
        document.querySelectorAll('.title').forEach((el) => {
          el.classList.add('animation-disabled');
        });
        document.querySelector('#nav').style.left = '-100px';

        await delay(1500);

        await hideMenu();

        showPlayer(borne.choices[index].path);
      }
    });
  });

  //Set the text for each button
  document.querySelectorAll('.choice').forEach((item, index) => {
    item.querySelector('.title.fr .text').innerText = borne.choices[index].fr;
    item.querySelector('.title.en .text').innerText = borne.choices[index].en;
  });

  //Check if titles are same in FR and EN to avoid switch animation
  borne.choices.forEach((item, index) => {
    titlesAreSame[index] = item.fr == item.en;
  });
  setTitleInterval();
}
function setTitleInterval() {
  //Start the interval to switch titles between languages
  titleInterval = setInterval(() => {
    if (currentVideo == null && switchTitles) {
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
