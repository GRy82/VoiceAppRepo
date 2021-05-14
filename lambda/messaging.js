var messagebird = require('messagebird')('2dXQgA9yZBLcxUiSaKcm3JYNI');//use config module later to store key, no hardcode.

function sendText(mobileNumber, textedUrl){
    var params = {
      'originator': 'MessageBird',
      'recipients': [
        mobileNumber
    ],
      'body': 'Use the following link to see the route demonstrated: ' + textedUrl
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });

}

module.exports = sendText;