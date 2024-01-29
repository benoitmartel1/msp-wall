var angle = 0;
var cellCount = 10;
var range;
var selectedIndex = 0;
var selectedThreshold = 8;
var transitionThreshold = 30;
var visibleThreshold = 100;
var transitionRange = transitionThreshold - selectedThreshold;
var waitingRange = visibleThreshold - transitionThreshold;

window.addEventListener('load', (e) => {
  //   var borne = data.bornes[1];
  var filteredBornes = data.bornes
    .flatMap((e) => e.choices)
    .filter(
      (v) => v.id !== borne.choices[0].id && v.id !== borne.choices[1].id
    );

  cellCount = filteredBornes.length;
  range = 360 / cellCount;

  var carousel = document.querySelector('.carousel');

  document
    .querySelector('.carousel-wrapper')
    .addEventListener('touchmove', function (e) {
      const touch = e.touches[0];

      if (previousTouch) {
        // be aware that these only store the movement of the first touch in the touches array
        e.movementX = touch.pageX - previousTouch.pageX;
        e.movementY = touch.pageY - previousTouch.pageY;

        // displayLog(e.movementX / e.currentTarget.offsetWidth);
        hasMoved = true;

        rotateCarousel((e.movementX / e.currentTarget.offsetWidth) * 4);
      }

      previousTouch = touch;
    });

  document
    .querySelector('.carousel-wrapper')
    .addEventListener('mousemove', (e) => {
      if (e.buttons == 1) {
        hasMoved = true;
        rotateCarousel((e.movementX / e.currentTarget.offsetWidth) * 2);
      }
    });

  document
    .querySelector('.carousel-wrapper')
    .addEventListener(touchEnd, async function (e) {
      if (hasMoved) {
        previousTouch = null;
        snapToClosestSpot();
        console.log('snapping');
      } else {
        //If carousel was not moving, then it's a click
        //Define where on carousel-wrapper the click happened
        var wrapperWidth = document
          .querySelector('.carousel-wrapper')
          .getBoundingClientRect().width;
        var arrowWidth = document
          .querySelector('.carousel-wrapper .arrow')
          .getBoundingClientRect().width;

        var hotZoneWidth = wrapperWidth - arrowWidth * 2;

        var clickedZone = Math.floor(
          ((e.pageX - arrowWidth) / hotZoneWidth) * 5
        );

        //If the user clicked one of the 5 images in carousel, retrieve which one
        if (clickedZone >= 0 && clickedZone < 5) {
          var sorted = Array.from(
            document.querySelectorAll(
              ".carousel-wrapper img:not([data-auto-rotate='undefined'])"
            )
          ).sort(function (a, b) {
            return a.dataset.autoRotate - b.dataset.autoRotate;
          });

          //Get the name of the clicked image
          var src = sorted[clickedZone].getAttribute('src');
          var videoName = src.substring(
            src.lastIndexOf('/') + 1,
            src.lastIndexOf('.')
          );

          await hideInfos();
          showPlayer(videoName);
        }
      }
    });

  function initCarousel() {
    var cell = 0;

    while (cell < cellCount) {
      let div = document.createElement('div');
      div.classList.add('carousel__cell');
      div.style.transform =
        'rotateY(' + (360 / cellCount) * cell + 'deg) translateZ(120px)';
      let img = document.createElement('img');
      img.src = 'images/videos/' + filteredBornes[cell].path + '.png';

      div.appendChild(img);
      carousel.appendChild(div);
      img.classList.add('disabled');
      img.addEventListener('load', fadeImg);
      cell++;
    }
    autoRotate(1);
  }

  function rotateCarousel(offset) {
    angle += offset * 360;
    carousel.style.transform = 'rotateY(' + angle + 'deg) translateY(20px)';

    for (var child in carousel.children) {
      var index = parseInt(child);

      if (!isNaN(index)) {
        var img = document.querySelector(
          '.carousel div:nth-child(' + (index + 1) + ') img'
        );

        var counterAngle = 360 - index * range - angle;

        if (img) {
          var correctedAngle = (angle + index * range) % 360;
          var remappedAngle = remap(correctedAngle);
          var scale = setScale(Math.abs(remappedAngle));
          var posX = setPosX(remappedAngle);
          img.style.transform =
            'rotateY(' +
            counterAngle +
            'deg) scale(' +
            scale +
            ') translateX(' +
            posX +
            'px)';
          img.style.opacity = setOpacity(Math.abs(remappedAngle));
          img.style.display = isVisible(Math.abs(remappedAngle))
            ? 'inherit'
            : 'none';
          img.dataset.autoRotate = setAutoRotate(remappedAngle);
          if (Math.abs(remappedAngle) < visibleThreshold) {
            img.classList.add('clickable');
          } else {
            img.classList.remove('clickable');
          }
        }
      }
      function remap(a) {
        if (a > 180) {
          return a - 360;
        } else if (a < -180) {
          return a + 360;
        } else {
          return a;
        }
      }
      function isVisible(a) {
        return a > 0 && a < visibleThreshold;
      }
      function setScale(a) {
        if (a >= 0 && a <= selectedThreshold) {
          return 0.8;
        } else if (a > selectedThreshold && a <= transitionThreshold) {
          return 0.8;
          // return 1 - ((a - selectedThreshold) / transitionRange) * 0.2;
        } else if (a < visibleThreshold) {
          return 0.8 + ((a - transitionThreshold) / waitingRange) * 0.08;
        } else {
          return 0.88;
        }
      }
      function setAutoRotate(a) {
        var absA = Math.abs(a);
        if (absA >= 0 && absA < visibleThreshold) {
          return Math.floor(
            ((a + visibleThreshold) / (visibleThreshold * 2)) * 5
          );
        } else {
          return undefined;
        }
      }
      //   function setAutoRotate(a) {
      //     var absA = Math.abs(a);
      //     if (absA >= 0 && absA <= selectedThreshold) {
      //       return 0;
      //     } else if (absA > selectedThreshold && absA < visibleThreshold) {
      //       // return Math.ceil((absA - selectedThreshold) / range) * (-1 * (a / absA));
      //       return -1 * (a / absA);
      //     } else {
      //       return undefined;
      //     }
      //   }
      function setPosX(angle) {
        var a = Math.abs(angle);
        var direction = (angle / Math.abs(angle)) * 1;

        if (a >= 0 && a <= selectedThreshold) {
          //If is selected, do not alter x position
          return 0;
        } else if (a > selectedThreshold && a <= transitionThreshold) {
          //If is within transition
          return (a - selectedThreshold) / transitionRange;
        } else if (a < visibleThreshold) {
          //If is visible
          return (
            1 - ((a - transitionThreshold) / waitingRange) * -100 * direction
          );
        }
      }
      function setOpacity(a) {
        if (a >= 72) {
          return 1 - (a - 72) / (visibleThreshold - 72);
        } else {
          return 1;
        }
      }
    }
  }
  function snapToClosestSpot() {
    var d = angle % range;

    var correction = 0;
    if (angle > 0) {
      correction = d < range / 2 ? -d : range - d;
    } else {
      correction = Math.abs(d) < range / 2 ? -d : -range - d;
    }

    var snapInterval = setInterval(() => {
      var inc = Math.abs(correction / range) * (correction < 0 ? -1 : 1);
      rotateCarousel(inc / 360);
      correction -= inc;
      if (Math.abs(correction) < 0.04) {
        clearInterval(snapInterval);
        hasMoved = false;
      }
    }, 6);
  }

  function autoRotate(steps) {
    //Calculate how many increments of .002 are necessary to move carousel by one step
    var intervals = range / (360 * 0.002) / 2 + 4;
    //Multiply required intervals by number of desired steps
    intervals *= Math.abs(steps);

    var autoRotateInterval = setInterval(() => {
      rotateCarousel(0.002 * (steps / Math.abs(steps)));
      intervals--;
      if (!intervals) {
        clearInterval(autoRotateInterval);
        snapToClosestSpot();
      }
    }, 10);
  }

  document.querySelector('.right.arrow').addEventListener('click', function () {
    autoRotate(1);
  });
  document.querySelector('.left.arrow').addEventListener('click', function () {
    autoRotate(-1);
  });

  initCarousel();
});
