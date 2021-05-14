var messagebird = require('messagebird')('2dXQgA9yZBLcxUiSaKcm3JYNI');//use config module later to store key, no hardcode.

function sendText(mobileNumber, text){
    var params = {
      'originator': 'MessageBird',
      'recipients': [
        mobileNumber
    ],
      'body': text
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return err;
      }
      console.log(response);
      return 'success';
    });

}

module.exports = sendText;