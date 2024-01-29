function WebSocketTest() {
  if ('WebSocket' in window) {
    // console.log('WebSocket is supported by your Browser!');

    // Let us open a web socket
    var ws = new WebSocket('ws://127.0.0.1:1880/msp/');

    ws.onopen = function () {
      //   console.log(ws);
      // Web Socket is connected, send data using send()
      ws.send('Message to send');
      // alert("Message is sent...");
    };

    ws.onmessage = async function (evt) {
      var message = JSON.parse(evt.data).payload;
      //   console.log(message);
      if (message == 'play' && currentSection == 'player') {
        document.querySelector('#video').play();
      } else if (message == 'pause' && currentSection == 'player') {
        document.querySelector('#video').pause();
      } else if (parseInt(message) > 0) {
        if (clickEnabled) {
          var filteredBornes = data.bornes.flatMap((e) => e.choices);
          var requestedVideoName = filteredBornes.find(
            (b) => b.id == message
          ).path;

          if (currentSection == 'menu') {
            await hideMenu();
          } else if (currentSection == 'player') {
            await hidePlayer();
          } else if (currentSection == 'infos') {
            await hideInfos();
          }
          showPlayer(requestedVideoName);
        }
      }
    };

    ws.onclose = function () {
      // websocket is closed.
      console.log('Connection is closed...');
      setTimeout(function () {
        WebSocketTest();
      }, 5000);
    };
  } else {
    // The browser doesn't support WebSocket
    console.log('WebSocket NOT supported by your Browser!');
  }
}
