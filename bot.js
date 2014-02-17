var IRC = require('irc')
  , slack = require('./lib/slacker');

var client = new IRC.Client('irc.freenode.com', 'slackbot', {
    channels: ['#hipsterdev'],
});

var slacker = new slack.Slacker({
    token: 'xoxp-2175856885-2175856887-2176637470-9337ab'
});

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
    slacker.send('chat.postMessage', {
        channel: '#irc',
        text: mapUsers(message),
        username: from
    });
});
