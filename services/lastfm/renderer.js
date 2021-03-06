if (require('../config.json').serviceConfig.whichService == 'lastfm') {
  const events = require('events');
  const fm = require('lastfm').LastFmNode;
  if(!config.serviceConfig.lastFM.username) { console.log("Please ensure you have set your 'username', 'key', and 'secret' in 'config.json' to use EasyRPC + lastFM."); process.exit(0); }
  const lastFm = new fm({ api_key: config.serviceConfig.lastFM.key, secret: config.serviceConfig.lastFM.secret, useragent: 'EasyRPC' });
  var songEmitter = new events.EventEmitter()

  const {
    webFrame
  } = require('electron');
  const parse = require('parse-duration')
  const moment = require('moment')
  const os = require('os');
  if (os.type() !== 'Darwin') {
    document.body.style.backgroundColor = '#4C4C4C'
  }

  webFrame.setZoomLevelLimits(1, 1);

  var text = "textContent" in document.body ? "textContent" : "innerText";

  var trackStream = lastFm.stream(config.serviceConfig.lastFM.username);

  trackStream.on('nowPlaying', song => {
    if (!rpc || !mainWindow)
      return;

      if (song.image["#text"]) {
        document.getElementById('artwork').src = song.image["#text"]
        if (document.getElementById('artwork').src) {
          document.getElementById('hide').style.display = 'none'
        }
      }

      var tP = ''
      if (require('../config.json').serviceConfig.titlePrefix) {
        tP = require('../config.json').serviceConfig.titlePrefix + ' '//.charAt(0);
      }
      var aP = ''
      if (require('../config.json').serviceConfig.artistPrefix) {
         aP = require('../config.json').serviceConfig.artistPrefix + ' '//.charAt(0);
      }

      document.getElementById('name')[text] = tP + song.name
      document.getElementById('artist')[text] = aP + song.artist["#text"]

    var activity = {
      largeImageKey: 'lastfm',
      largeImageText: 'lastFM',
      details: song.name,
      state: song.artist["#text"],
      instance: false
    }

    rpc.setActivity(activity)

    console.log(song)
  });

  trackStream.start();
}
